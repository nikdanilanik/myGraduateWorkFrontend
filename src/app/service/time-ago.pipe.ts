import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | null): string {
    if (!value) return 'нет данных';

    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(value).getTime()) / 1000); // разница в секундах
    if (diff < 60) {
      return 'онлайн';
    } else if (diff < 120) {
      return 'минуту назад';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} минут назад`;
    } else if (diff < 7200) {
      return 'час назад';
    } else {
      const hours = Math.floor(diff / 3600);
      return `${hours} часов назад`;
    }
  }
}
