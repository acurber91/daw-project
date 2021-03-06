/*=============================================================================
 * Author: Agustín Curcio Berardi based on the example project written by 
   Agustin Bassi, Brian Ducca and Santiago Germino.
 * Date: October 2020
 * Licence: GPLV3+
 * Project: Trabajo Práctico Final - DAW - CEIoT
 * Brief: Main frontend file (where the logic is)
=============================================================================*/

//=======[ Settings, Imports & Data ]==========================================
interface DeviceInt
{
    id: number;             // ID.
    name: string;           // Nombre del dispositivo.
    description: string;    // Descripción del dispositivo.
    state: number;          // Estado del dispositivo (solo on/off).
    type: number;           // Capacidad del dispositivo (on/off o dimerizable).
    percent: number;        // Rango actual del dispositivo (solo dimerizable)
    appliance: number;      // Tipo de dispositivo.
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

        // En base al "id" del elemento, se recupera la información particular requerida para cada uno de los elementos.
        // Para eso, nos quedamos con los primeros cuatro caracteres del "id" y los evaluamos en un switch.
        let elemToggled:string = b.id.substring(0, 4);
        // Se modificó el switch.

        switch(elemToggled)
        {
            // Se accionó el slider.
            case("sli_"):
            {
                // Leemos el valor actual del slider.
                let sliderValue:number = this.view.getRangeValueById(b.id);

                // Armamos el paquete de datos para enviar en el POST.
                let sliderData = {"id":elementId, "percent":sliderValue}

                // Enviamos el POST al backend.
                this.myf.requestPOST("http://localhost:8000/devices", sliderData, this);
                break;
            }
            // Se accionó el switch.
            case("dev_"):
            {
                // Leemos el valor actual del switch.
                let switchState:number = this.view.getSwitchStateById(b.id);

                // Armamos el paquete de datos para enviar en el POST.
                let switchData = {"id":elementId, "state":switchState}

                // Enviamos el POST al backend.
                this.myf.requestPOST("http://localhost:8000/devices", switchData, this);
                break;
            }
            // Se accionó el botón de eliminar.
            case("del_"):
            {
                // Guardamos en un atributo privada el "id" del dispositivo que se desea borrar.
                // Esta información será luego utilizada por el botón del modal que confirma el borrado.
                this._delDevice = elementId;
                break;
            }
            // Se accionó el botón de editar.
            case("edi_"):
            {
                // Guardamos en una variable privada el "id" del dispositivo que se desea editar.
                // Esta información será luego utilizada por el botón del modal que confirma la edición.
                this._ediDevice = elementId;

                // Nos toca reconstruir el formulario del modal con los datos actuales del dispositivo.
                (<HTMLInputElement>this.myf.getElementById('mod_name')).value = this.myf.getElementById(`nameDev_${elementId}`).innerText;
                (<HTMLInputElement>this.myf.getElementById('mod_description')).value = this.myf.getElementById(`descriptionDev_${elementId}`).innerText;

                // Obtenemos cual es el ícono asignado al dispositivo.
                let deviceIcon:string = this.myf.getElementById(`icon_${elementId}`).innerText;

                // Y en base al ícono, seleccionamos el tipo de dispositivo.
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

                    case("sensor_window"):
                    {
                        (<HTMLInputElement>this.myf.getElementById('mod_appliance')).value = "6";
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
                break;
            }
            // Se accionó el botón para agregar dispositivos.
            case("add_"):
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
                break;
            }
            // Se accionó el botón para eliminar dispositivos.
            case("eli_"):
            {
                // Armamos el paquete de datos para enviar en el DELETE.
                let delData = {"id":this._delDevice}

                // Reiniciamos la variable a su estado inicial.
                this._delDevice = 0;

                // Enviamos el POST al backend.
                this.myf.requestDELETE("http://localhost:8000/devices", delData, this);

                // Se actualiza la página para que se muestre el estado actual de los dispositivos.
                window.location.reload();
                break;
            }
            // Se accionó el botón para editar dispositivos.
            case("mod_"):
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

                // Enviamos el POST al backend.
                this.myf.requestPOST("http://localhost:8000/devices", modData, this);

                // Se actualiza la página para que se muestre el dispositivo recientemente agregado.
                window.location.reload();
                break;
            }

            default:
            {
                break;
            }
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
