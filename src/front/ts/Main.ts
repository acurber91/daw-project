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

    main():void 
    {
        
        let modal = document.querySelector('.modal');
        M.Modal.init(modal, {opacity: 0.7});

        this.myf = new MyFramework();
        this.view = new ViewMainPage(this.myf);

        this.myf.requestGET("http://localhost:8000/devices", this);
    }

    handleEvent(evt:Event):void
    {
        console.log(`Se hizo ${evt.type}`); // BORRAR
        let b:HTMLElement = this.myf.getElementByEvent(evt);
        console.log(b);

        // Recuperamos el "id" del elemento para poder actualizar el registro en el backend.
        let elementId:number = Number(b.id.substr(b.id.indexOf("_") + 1, b.id.length - 4));

        if(b.id == "add_dev")
        {            
            // Se recuperan todos los datos que se ingresaron en el formulario.
            let name:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("add_name");
            let noSpacesName:string = name.value.replace(/ /g, ' ');
            let description:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("add_description");
            let noSpacesDescription:string = description.value.replace(/ /g, ' ');
            let feature:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("feature");
            let appliance:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("appliance");

            // Se arma el paquete para enviarlo a través de POST.
            let addData = {"name":noSpacesName, "description":noSpacesDescription, "state":0, "type":Number(feature.value), "percent":0, "appliance":Number(appliance.value)}

            // Enviamos el POST al backend.
            this.myf.requestPOST("http://localhost:8000/devices", addData, this);

            // Se actualiza la página para que se muestre el dispositivo recientemente agregado.
            window.location.reload();
        }

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
        if(b.id.substring(0, 4) == "del_") 
        {            

        }
    }

    handleGETResponse(status: number, response: string): void 
    {
        console.log("Respuesta del servidor: " + response);
        // Se hace un parsing de la respuesta enviada por el servidor.
        let data: DeviceInt[] = JSON.parse(response);

        // Objeto para asociar todos los eventos.
        let a:HTMLElement
        
        // Asociamos el botón para agregar nuevos dispositivos a un evento del tipo "click".
        a = this.myf.getElementById(`add_dev`);
        a.addEventListener("click", this);

        console.log(data);
        // Se procesa el contenido de la base de datos para mostrarlo en el frontend.
        this.view.showDevices(data);

        // Evaluamos los distintos botones y actuadores para asignarles un evento.
        for (let i of data)
        {            
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
