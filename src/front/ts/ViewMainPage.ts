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
            let image = "lightbulb.png";
            if (dev.type == "1")
            {
                image = "window.png";
            }

            let state = "";
            if (dev.state == "1")
            {
                state = "checked";
            }
            
            e.innerHTML +=  `<li class="collection-item avatar">
                            <img src="static/images/${image}" alt="" class="circle">
                            <span class="title">${dev.name}</span>
                            <p>${dev.description}</p>
                            <a href="#!" class="secondary-content">
                                <div class="switch">
                                    <label>
                                    Off
                                    <input id="dev_${dev.id}" type="checkbox" ${state}>
                                    <span class="lever"></span>
                                    On
                                    </label>
                                </div>
                            </a>
                        </li>`;
        }
    }

    getSwitchStateById(id:string):boolean
    {
        let e:HTMLElement = this.myf.getElementById(id);
        let i:HTMLInputElement = <HTMLInputElement> e;
        return i.checked;
    }
}