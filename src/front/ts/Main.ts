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
    id: number;
    name: string;
    description: string;
    state: number;
    type: number;
    percent: number;
    appliance: number;
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
        console.log(`Se hizo ${evt.type}`); // BORRAR
        let b:HTMLElement = this.myf.getElementByEvent(evt);

        // Recuperamos el "id" del elemento para poder actualizar el registro en el backend.
        let elementId:number = Number(b.id.substr(b.id.indexOf("_") + 1, b.id.length - 4));

        // En base al "id" del elemento, se recupera la información particular para cada caso.
        if(b.id.substring(0, 4) == "sli_")
        {
            // Leemos el valor actual del slider.
            let sliderValue:number = this.view.getRangeValueById(b.id);

            // Armamos el paquete de datos para enviar en el POST.
            let sliderData = {"id":elementId, "percent":sliderValue}

            // Enviamos el POST al backend.
            this.myf.requestPOST("http://localhost:8000/devices", sliderData, this); 
        }
        if(b.id.substring(0, 4) == "dev_")
        {
            // Leemos el valor actual del switch.
            let switchState:number = this.view.getSwitchStateById(b.id);

            // Armamos el paquete de datos para enviar en el POST.
            let switchData = {"id":elementId, "state":switchState}

            // Enviamos el POST al backend.
            this.myf.requestPOST("http://localhost:8000/devices", switchData, this);
        }    
    }

    handleGETResponse(status: number, response: string): void 
    {
        console.log("Respuesta del servidor: " + response);
        // Se hace un parsing de la respuesta enviada por el servidor.
        let data: DeviceInt[] = JSON.parse(response);

        console.log(data);
        // Se procesa el contenido de la base de datos para mostrarlo en el frontend.
        this.view.showDevices(data);

        // Evaluamos los distintos botones y actuadores para asignarles un evento.
        for (let i of data)
        {
            // Objeto para asociar todos los eventos.
            let a:HTMLElement
            
            // Primero el botón de edición.
            a = this.myf.getElementById(`edi_${i.id}`);
            // Y le asociamos el evento.
            a.addEventListener("click", this);

            // Segundo el botón para eliminar.
            a = this.myf.getElementById(`del_${i.id}`);
            // Y le asociamos el evento.
            a.addEventListener("click", this);

            // Y por último el actuador. En base al tipo de equipo, busco distintos elementos.
            if(i.type == 0)
            {
                // Si type = 0, busco el switch asociado.
                a = this.myf.getElementById(`dev_${i.id}`);
            }
            else
            {
                // Si type = 1, busco el slider asociado.
                a = this.myf.getElementById(`sli_${i.id}`);
            }
            // Cualquiera haya sido, los asocio al evento.
            a.addEventListener("click", this);         
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
