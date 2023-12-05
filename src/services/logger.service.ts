import { LoggerService } from '@nestjs/common';
import { Format_YYYY_MM_DD_HH_mm_ss } from 'src/common/utils/formatTime/formatTime';

export class LoggerCustom implements LoggerService {
  c_red = '\x1b[31m';
  c_green = '\x1b[32m';
  c_yellow = '\x1b[33m';
  c_blue = '\x1b[34m';
  c_white = '\x1b[37m';
  getTime() {
    const time = new Date();
    return Format_YYYY_MM_DD_HH_mm_ss(time.toString()).time;
  }
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(
      `${this.c_green}[Nest] -`,
      `${this.c_white}${this.getTime()}\t`,
      `${this.c_green}LOG`,
      `${this.c_yellow}${message}`,
    );
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    console.log(
      `${this.c_green}[Nest] -`,
      `${this.c_white}${this.getTime()}\t`,
      `${this.c_red}FATAL`,
      `${this.c_red}${message}`,
    );
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.log(
      `${this.c_green}[Nest] -`,
      `${this.c_white}${this.getTime()}\t`,
      `${this.c_red}ERROR`,
      `${this.c_red}${message}`,
    );
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.log(
      `${this.c_green}[Nest] -`,
      `${this.c_white}${this.getTime()}\t`,
      `${this.c_yellow}WARN`,
      `${this.c_white}${message}`,
    );
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.log(
      `${this.c_green}[Nest] -`,
      `${this.c_white}${this.getTime()}\t`,
      `${this.c_blue}DEBUG`,
      `${this.c_white}${message}`,
    );
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(
      `${this.c_green}[Nest] -`,
      `${this.c_white}${this.getTime()}\t`,
      `${this.c_yellow}DEBUG`,
      `${this.c_white}${message}`,
    );
  }
}
