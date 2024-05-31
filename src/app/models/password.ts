export class Password {
  constructor(id?: number, pass?: string) {
    this.id = null;
    if (id != undefined) this.id = id;
    this.pass = "";
    if (pass != undefined) this.pass = pass;
  }

  id: number | null;
  pass: string;
}
