import requireAll from 'require-all';
import fs from 'mz/fs';
import Agenda from 'agenda';
import Base from 'magnet-core/dist/base';
import defaultConfig from './config/agenda';

export default class Scheduler extends Base {
  async setup() {
    let config = Object.assign(defaultConfig, this.app.config.agenda);
    let schedulers = {};

    config.db.address = `${config.db.host}:${config.db.port}/${config.db.database}`;
    if (config.db.username || config.db.password) {
      config.db.address = `${config.db.username}:${config.db.password}@${address}`;
    }

    try {
      const folderPath = process.cwd() + '/server/schedulers';
      await fs.exists(folderPath);
      schedulers = requireAll(folderPath);
    } catch (err) {
      this.log.warn(err);
    }

    this.app.agenda = new Agenda(config);

    this.app.agenda.on('fail', (err) => {
      this.log.error(err);
    });

    // Prepare scheduler
    for (let key of Object.keys(schedulers)) {
      let scheduler = schedulers[key].default || schedulers[key];
      let name = scheduler.name || key;
      let processArgs = [name];
      if (scheduler.options) {
        processArgs.push(scheduler.options);
      }

      if (scheduler.process) {
        processArgs.push(async (data, done) => {
          try {
            done(null, await scheduler.process.call(this, this.app, data));
          } catch (err) {
            done(err);
          }
        });
      } else {
        this.log.warn(`No process for ${name}`);
      }

      this.app.agenda.define.apply(this.app.agenda, processArgs);
    }

    this.app.agenda.on('ready', () => {
      for (let key of Object.keys(schedulers)) {
        let scheduler = schedulers[key].default || schedulers[key];
        let name = scheduler.name || key;

        if (scheduler.every) {
          this.app.agenda.every(scheduler.every, name);
        } else if (scheduler.schedule) {
          this.app.agenda.schedule(scheduler.schedule, name);
        } else {
          this.log.warn(`No time schedule for ${name}`);
        }
      }

      this.app.agenda.start();
    });
  }
}
