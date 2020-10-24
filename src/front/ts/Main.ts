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

class Main implements EventListenerObject, GETResponseListener, POSTResponseListener
{
    myf:MyFramework;
    view:ViewMainPage;
    counter:number = 0;

    main():void 
    {
        this.myf = new MyFramework();
        this.view = new ViewMainPage(this.myf);
        this.myf.requestGET("http://localhost:8000/devices", this);
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
            // Recuperamos el estado actual del switch.
            let state:boolean = this.view.getSwitchStateById(b.id);
            // Recuperamos el "id" del switch para poder actualizar el registro en el backend.
            let switchId:string = b.id.substr(b.id.indexOf("_") + 1, b.id.length - 4);
            // Armamos el paquete de datos para enviar en el POST.
            let data = {"id":switchId, "state":state}
            // Enviamos el POST al backend.
            this.myf.requestPOST("http://localhost:8000/devices", data, this);
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

window.onload = function () 
{
    let m:Main = new Main();
    m.main();
}

//=======[ End of file ]=======================================================
