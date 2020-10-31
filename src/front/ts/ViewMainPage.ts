class ViewMainPage
{
    private myf: MyFramework;
    
    constructor(myf: MyFramework)
    {
        this.myf = myf;
    }
    
    showDevices(list: DeviceInt[]):void
    {
        let e: HTMLElement = this.myf.getElementById("devicesList");
        for (let dev of list)
        {
            // Seleccionamos el ícono de cada uno de los dispositivos.
            let icon = "";
            switch (dev.appliance)
            {
                case (0):
                {
                    icon = "lightbulb_outline";
                    break;
                }
                case (1):
                {
                    icon = "ac_unit";
                    break;
                }
                case (2):
                {
                    icon = "music_note";
                    break;
                }
                case (3):
                {
                    icon = "tv";
                    break;
                }
                case (4):
                {
                    icon = "toys";
                    break;
                }
                case (5):
                {
                    icon = "outlet";
                    break;
                }
                default:
                {
                    icon = "cancel";
                    break;
                }
            }            

            if (dev.type == 0)
            {
                // Se consulta el estado del switch en la base de datos.
                let state = "";
                if(dev.state == 1)
                {
                    state = "checked";
                }
                
                e.innerHTML += `<div class="col s3">
                                    <div class="card blue darken-3">
                                        <div class="card-content white-text">
                                            <i id="icon_${dev.id}" class="small material-icons" style="margin-left: -5px;">${icon}</i>
                                            <span id="nameDev_${dev.id}" class="card-title"><b><b>${dev.name}</b></b></span>
                                            <p id="descriptionDev_${dev.id}">${dev.description}</p>
                                            <br>
                                            <div class="switch">
                                            <label>
                                                <input id="dev_${dev.id}" type="checkbox" ${state}>
                                                <span class="lever" style="margin-left: 0px;"></span>
                                            </label>
                                            <div class="card-action">
                                                <a class="modal-trigger" href="#modal3" id="edi_${dev.id}">Editar</a>
                                                <a class="modal-trigger" href="#modal2" id="del_${dev.id}">Eliminar</a>
                                          </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>`;
            }
            else
            {            
                e.innerHTML += `<div class="col s3">
                                    <div class="card blue darken-3">
                                        <div class="card-content white-text">
                                            <i id="icon_${dev.id}" class="small material-icons" style="margin-left: -5px;">${icon}</i>
                                            <span id="nameDev_${dev.id}" class="card-title"><b><b>${dev.name}</b></b></span>
                                            <p id="descriptionDev_${dev.id}">${dev.description}</p>
                                            <br>
                                            <form action="#">
                                                <p class="range-field">
                                                    <input type="range" id="sli_${dev.id}" min="0" max="100" value="${dev.percent}"/>
                                                </p>
                                            </form>
                                            <div class="card-action">
                                                <a class="modal-trigger" href="#modal3" id="edi_${dev.id}">Editar</a>
                                                <a class="modal-trigger" href="#modal2" id="del_${dev.id}">Eliminar</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
            }
        }
    }

    getSwitchStateById(id:string):number
    {
        let e:HTMLElement = this.myf.getElementById(id);
        let i:HTMLInputElement = <HTMLInputElement> e;
        if(i.checked == true)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    }
    
    getRangeValueById(id:string):number
    {
        let e:HTMLElement = this.myf.getElementById(id);
        let i:HTMLInputElement =  <HTMLInputElement> e;
        return Number(i.value);
    }
}