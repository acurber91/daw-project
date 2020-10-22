// Ejercicio 3
class User 
{
    private _id:number;
    private _name:string;
    private _email:string;
    private _isLogged:boolean;

    constructor(id:number, name:string, email:string) 
    {
        this._id = id;
        this._name = name;
        this._email = email;
    }

    set id(id:number)
    {
        this._id = id;
    }

    get id():number
    {
        return this._id;
    }

    set name(name:string)
    {
        this._name = name;
    }

    get name():string
    {
        return this._name;
    }

    set email(email:string)
    {
        this._email = email;
    }

    get email():string
    {
        return this._email;
    }

    set isLogged(isLogged:boolean)
    {
        this._isLogged = isLogged;
    }

    get isLogged():boolean
    {
        return this._isLogged;
    }

    printInfo():void
    {
        console.log("ID = " + this._id + ", Name = " + this._name + ", E-mail = " + this._email + ", Logged = " + this._isLogged + ".") ;
    }
}