// import { Component, Injectable } from '@angular/core';
// import { User } from 'src/app/models/user';
// import { UserLoginAndPass } from 'src/app/models/userLoginAndPass';
// import { BaseServiceService } from 'src/app/service/base-service.service';

// @Component({
//   selector: 'app-in-memory-data',
//   templateUrl: './in-memory-data.component.html'
// })

// @Injectable({
//   providedIn: 'root'
// })

// export class InMemoryDataComponent implements InMemoryDataComponent {

//   createDb() {
//     const users = [
//       {id: 0, name: 'No', surname: 'Name',                info: 'Инфа0', dateOfRegist: new Date(), wasTheLastTime: new Date(1), avatar: "https://static10.tgstat.ru/channels/_0/64/6471e19cd8c9bbe4fbbd4ec33bf3d1f0.jpg",  logAndPass: {id: 0, user_id: 0, login: "qwerty0", password: "1234"}},
//       {id: 1, name: 'Дед', surname: 'Инсайд',             info: 'Инфа1', dateOfRegist: new Date(), wasTheLastTime: new Date(1), avatar: "https://avavatar.ru/images/full/19/mrBXqhnN32kQnYeK.jpg",                         logAndPass: {id: 1, user_id: 1, login: "qwerty1", password: "1234"}},
//       {id: 2, name: 'Какаши', surname: 'Хатаке',          info: 'Инфа2', dateOfRegist: new Date(), wasTheLastTime: new Date(1), avatar: "https://pixelbox.ru/wp-content/uploads/2021/09/cool-avatar-tik-tok-3.jpeg",       logAndPass: {id: 2, user_id: 2, login: "qwerty2", password: "1234"}},
//       {id: 3, name: 'Владимир', surname: 'Владимирович',  info: 'Инфа3', dateOfRegist: new Date(), wasTheLastTime: new Date(1), avatar: "https://static10.tgstat.ru/channels/_0/45/45b865d134d2c25cf5ed131317fe88de.jpg",  logAndPass: {id: 3, user_id: 3, login: "qwerty3", password: "1234"}},
//       {id: 4, name: 'Имя4', surname: 'Фимилия4',          info: 'Инфа4', dateOfRegist: new Date(), wasTheLastTime: new Date(1), avatar: "https://static10.tgstat.ru/channels/_0/64/6471e19cd8c9bbe4fbbd4ec33bf3d1f0.jpg",  logAndPass: {id: 4, user_id: 4, login: "qwerty4", password: "1234"}},
//       {id: 5, name: 'Имя5', surname: 'Фимилия5',          info: 'Инфа5', dateOfRegist: new Date(), wasTheLastTime: new Date(1), avatar: "https://static10.tgstat.ru/channels/_0/64/6471e19cd8c9bbe4fbbd4ec33bf3d1f0.jpg",  logAndPass: {id: 5, user_id: 5, login: "qwerty5", password: "1234"}},
//       {id: 6, name: 'Имя6', surname: 'Фимилия6',          info: 'Инфа6', dateOfRegist: new Date(), wasTheLastTime: new Date(1), avatar: "https://static10.tgstat.ru/channels/_0/64/6471e19cd8c9bbe4fbbd4ec33bf3d1f0.jpg",  logAndPass: {id: 6, user_id: 6, login: "qwerty6", password: "1234"}},
//       {id: 7, name: 'Имя7', surname: 'Фимилия7',          info: 'Инфа7', dateOfRegist: new Date(), wasTheLastTime: new Date(1), avatar: "https://static10.tgstat.ru/channels/_0/64/6471e19cd8c9bbe4fbbd4ec33bf3d1f0.jpg",  logAndPass: {id: 7, user_id: 7, login: "qwerty7", password: "1234"}}
//     ];
//     const chat_0_0 = [
//       {id: 0, chat_id: 0, sender_id: 0, text:"Привет!",               created: new Date(), deliveryRead: true, attachedFileId: null},
//       {id: 1, chat_id: 0, sender_id: 1, text:"привет",                created: new Date(), deliveryRead: true, attachedFileId: null},
//       {id: 2, chat_id: 0, sender_id: 0, text:"Как дела?",             created: new Date(), deliveryRead: true, attachedFileId: null},
//       {id: 3, chat_id: 0, sender_id: 1, text:"норм. у тебя?",         created: new Date(), deliveryRead: true, attachedFileId: null},
//       {id: 4, chat_id: 0, sender_id: 0, text:"Хорошо. Гулять идём?",  created: new Date(), deliveryRead: true, attachedFileId: null},
//       {id: 5, chat_id: 0, sender_id: 1, text:"нет",                   created: new Date(), deliveryRead: true, attachedFileId: null},
//       {id: 6, chat_id: 0, sender_id: 0, text:"Ну и ладно",            created: new Date(), deliveryRead: true, attachedFileId: null}
//     ];
//     const messeges = [
//       {id: 0, chat_id: 0, id_user_two: 0}
//     ];
//     return {users, chat_0_0, messeges};
//   }

//   genId(users: User[]): number {
//     return users.length > 0 ? Math.max(...users.map(users => users.id ? users.id : 0)) + 1 : 11;
//   }
// }
