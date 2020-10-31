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
    private _delDevice:number = 0;
    private _ediDevice:number = 0;

    main():void 
    {
        // Se inicializa el componente de "Modal" provisto por Materialize.
        let modal = document.querySelectorAll('.modal');
        M.Modal.init(modal, {opacity: 0.7});

        this.myf = new MyFramework();
        this.view = new ViewMainPage(this.myf);

        this.myf.requestGET("http://localhost:8000/devices", this);
    }

    handleEvent(evt:Event):void
    {
        // Guardamos el elemento que fue disparado por el evento en un objeto.
        let b:HTMLElement = this.myf.getElementByEvent(evt);

        // Recuperamos el "id" del elemento para poder actualizar el registro en el backend.
        let elementId:number = Number(b.id.substr(b.id.indexOf("_") + 1, b.id.length - 4));

        // En base al "id" del elemento, se recupera la información particular para cada caso.
        // Se modificó el switch.
        if(b.id.substring(0, 4) == "sli_")
        {
            // Leemos el valor actual del slider.
            let sliderValue:number = this.view.getRangeValueById(b.id);

            // Armamos el paquete de datos para enviar en el POST.
            let sliderData = {"id":elementId, "percent":sliderValue}

            // Enviamos el POST al backend.
            this.myf.requestPOST("http://localhost:8000/devices", sliderData, this); 
        }
        
        // Se modificó el slider.
        if(b.id.substring(0, 4) == "dev_") 
        {
            // Leemos el valor actual del switch.
            let switchState:number = this.view.getSwitchStateById(b.id);

            // Armamos el paquete de datos para enviar en el POST.
            let switchData = {"id":elementId, "state":switchState}

            // Enviamos el POST al backend.
            this.myf.requestPOST("http://localhost:8000/devices", switchData, this);
        }

        // Se accionó el botón de eliminar o editar.
        if(b.id.substring(0, 4) == "del_") 
        {
            // Guardamos en una variable privada el "id" del dispositivo que se desea borrar o editar.
            this._delDevice = elementId;
        }

        if(b.id.substring(0, 4) == "edi_") 
        {
            // Guardamos en una variable privada el "id" del dispositivo que se desea borrar o editar.
            this._ediDevice = elementId;
            console.log(elementId);
            
            // Reemplazamos todos los valores en el modal para editar dispositivo.
            (<HTMLInputElement>this.myf.getElementById('mod_name')).value = this.myf.getElementById(`nameDev_${elementId}`).innerText;
            (<HTMLInputElement>this.myf.getElementById('mod_description')).value = this.myf.getElementById(`descriptionDev_${elementId}`).innerText;
            
            // Obtenemos cual es el ícono asignado al dispositivo.
            let deviceIcon:string = this.myf.getElementById(`icon_${elementId}`).innerText;
            
            // Y en base al ícono, seleccionamos una categoría.
            switch(deviceIcon)
            {
                case ("lightbulb_outline"):
                {
                    (<HTMLInputElement>this.myf.getElementById('mod_appliance')).value = "0";
                    break;
                }

                case ("ac_unit"):
                {
                    (<HTMLInputElement>this.myf.getElementById('mod_appliance')).value = "1";
                    break;
                }

                case ("music_note"):
                {
                    (<HTMLInputElement>this.myf.getElementById('mod_appliance')).value = "2";
                    break;
                }

                case ("tv"):
                {
                    (<HTMLInputElement>this.myf.getElementById('mod_appliance')).value = "3";
                    break;
                }
                
                case ("toys"):
                {
                    (<HTMLInputElement>this.myf.getElementById('mod_appliance')).value = "4";
                    break;
                }

                case ("outlet"):
                {
                    (<HTMLInputElement>this.myf.getElementById('mod_appliance')).value = "5";
                    break;
                }

                default:
                {
                    (<HTMLInputElement>this.myf.getElementById('mod_appliance')).value = "";
                    break;
                }
            }

            // Falta conocer la funcionalidad del dispositivo. Para ello, buscamos el elemento del tipo switch.
            let deviceFeature = this.myf.getElementById(`dev_${elementId}`);
            // Si se encuentra, a la lista desplegable le asignamos el valor "0" (On/Off).
            if(deviceFeature)
            {
                (<HTMLInputElement>this.myf.getElementById('mod_feature')).value = "0";
            }
            // Si no se encuentra, se le asignamos el valor "1" (Dimerizable).
            else
            {
                (<HTMLInputElement>this.myf.getElementById('mod_feature')).value = "1";
            }
        }
        
        // 
        if(b.id == "add_dev")
        {            
            // Se recuperan todos los datos que se ingresaron en el formulario.
            let addName:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("add_name");
            let addNoSpacesName:string = addName.value.replace(/ /g, ' ');
            let addDescription:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("add_description");
            let addNoSpacesDescription:string = addDescription.value.replace(/ /g, ' ');
            let addFeature:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("add_feature");
            let addAppliance:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("add_appliance");

            // Se arma el paquete para enviarlo a través de POST.
            let addData = {"name":addNoSpacesName, "description":addNoSpacesDescription, "state":0, "type":Number(addFeature.value), "percent":0, "appliance":Number(addAppliance.value)}

            // Enviamos el POST al backend.
            this.myf.requestPOST("http://localhost:8000/devices", addData, this);

            // Se actualiza la página para que se muestre el dispositivo recientemente agregado.
            window.location.reload();
        }

        if(b.id == "eli_dev") 
        {            
            // Armamos el paquete de datos para enviar en el DELETE.
            let delData = {"id":this._delDevice}

            // Reiniciamos la variable a su estado inicial.
            this._delDevice = 0;

            // Enviamos el POST al backend.
            this.myf.requestDELETE("http://localhost:8000/devices", delData, this);

            // Se actualiza la página para que se muestre el estado actual de los dispositivos.
            window.location.reload();
        }

        if(b.id == "mod_dev") 
        {            
            // Se recuperan todos los datos que se ingresaron en el formulario.
            let modName:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("mod_name");
            let modNoSpacesName:string = modName.value.replace(/ /g, ' ');
            let modDescription:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("mod_description");
            let modNoSpacesDescription:string = modDescription.value.replace(/ /g, ' ');
            let modFeature:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("mod_feature");
            let modAppliance:HTMLInputElement = <HTMLInputElement>this.myf.getElementById("mod_appliance");
            
            // Se arma el paquete para enviarlo a través de POST.
            let modData = {"id":this._ediDevice, "name":modNoSpacesName, "description":modNoSpacesDescription, "type":Number(modFeature.value), "appliance":Number(modAppliance.value)}

            console.log(modData);
            // Enviamos el POST al backend.
            this.myf.requestPOST("http://localhost:8000/devices", modData, this);

            // Se actualiza la página para que se muestre el dispositivo recientemente agregado.
            window.location.reload();
        }
    }

    handleGETResponse(status: number, response: string): void 
    {
        // Se hace un parsing de la respuesta enviada por el servidor.
        let data: DeviceInt[] = JSON.parse(response);

        // Objeto para asociar todos los eventos.
        let a:HTMLElement
        
        // Asociamos el botón del modal para agregar nuevos dispositivos a un evento del tipo "click".
        a = this.myf.getElementById(`add_dev`);
        a.addEventListener("click", this);

        // Asociamos el botón del modal para eliminar dispositivos existentes a un evento del tipo "click".
        a = this.myf.getElementById(`eli_dev`);
        a.addEventListener("click", this);

        // Asociamos el botón del modal para editar dispositivos existentes a un evento del tipo "click".
        a = this.myf.getElementById(`mod_dev`);
        a.addEventListener("click", this);

        // Se procesa el contenido de la base de datos para mostrarlo en el frontend.
        this.view.showDevices(data);

        // Evaluamos los distintos botones y actuadores para asignarles un evento.
        for (let i of data)
        {            
            // Primero el botón de eliminar.
            a = this.myf.getElementById(`del_${i.id}`);
            // Y le asociamos el evento.
            a.addEventListener("click", this);

            // Luego el botón de editar.
            a = this.myf.getElementById(`edi_${i.id}`);
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
            // Cualquiera haya sido, los asocio al evento "click".
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
