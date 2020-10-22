/*=============================================================================
 * Authors: Agustin Bassi, Brian Ducca, Santiago Germino 
 * Date: Jul 2020
 * Licence: GPLV3+
 * Project: DAW - CEIoT - Project Structure
 * Brief: Main frontend file (where the logic is)
=============================================================================*/

//=======[ Settings, Imports & Data ]==========================================
interface DeviceInt
{
    id: string;
    name: string;
    description: string;
    state: string;
    type: string;
}


let user = "TypesScript Users!";
// Ejercicio 2
class Main implements EventListenerObject, GETResponseListener, POSTResponseListener
{
    myf:MyFramework;
    view:ViewMainPage;
    counter:number = 0;

    main():void 
    {
        console.log("Soy un mensaje dentro del main.");
        let usuarios:Array<User>;
        usuarios = new Array<User>();
        usuarios.push(new User(1, "Carlos", "carlos@gmail.com"));
        usuarios.push(new User(2, "Pedro", "pedro@gmail.com"));
        usuarios.push(new User(3, "Juan", "juan@gmail.com"));

        this.mostrarUsers(usuarios);

        this.myf = new MyFramework();
        this.view = new ViewMainPage(this.myf);
        let b:HTMLElement = this.myf.getElementById("boton");
        b.textContent = "Prueba";
        // Ejercicio 5 
        b.addEventListener("click", this);
        this.myf.requestGET("Devices.txt", this);
    }

    mostrarUsers(users:Array<User>):void
    {
        for(let i in users)
        {
            users[i].printInfo();
        }
        // Otra forma de iterar en TypeScript en objetos iterables.
        // for (let o of users)
        // {
        //      o.printInfo();
        // }
    }

    handleEvent(evt:Event):void
    {
        console.log(`Se hizo ${evt.target}`);
        let b:HTMLElement = this.myf.getElementByEvent(evt);
        console.log(b);

        if(b.id == "boton")
        {
            this.counter++;
            b.textContent = `Click ${this.counter}`;
        }
        else
        {
            let state:boolean = this.view.getSwitchStateById(b.id);
            let data = { "id":`${this.counter}`, "state":state}
            this.myf.requestPOST("Devices.php", data, this);
        }       
    }

    handleGETResponse(status: number, response: string): void 
    {
        console.log("Respuesta del servidor: " + response);
        
        let data: DeviceInt[] = JSON.parse(response);

        console.log(data);

        this.view.showDevices(data);

        for (let d of data)
        {
            let b:HTMLElement = this.myf.getElementById(`dev_${d.id}`);
            b.addEventListener("click", this);
        }
    }

    handlePOSTResponse(status: number, response: string): void 
    {
        console.log(status);
        console.log(response);     
    }
}

//=======[ Main module code ]==================================================

function greeter(person) 
{
    return "Hello, " + person;
}
 
// document.body.innerHTML = greeter(user);

console.log("¡Hola mundo!")

window.onload = function () 
{
    let m:Main = new Main();
    m.main();
}

//=======[ End of file ]=======================================================
