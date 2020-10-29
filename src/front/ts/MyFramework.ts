// Interfaz para definir el handler que atenderá el método GET.
interface GETResponseListener
{
    handleGETResponse(status:number, response:string):void;
}

// Interfaz para definir el handler que atenderá el método POST.
interface POSTResponseListener
{
    handlePOSTResponse(status:number, response:string):void;
}

class MyFramework
{
    getElementById(id:string):HTMLElement
    {
        let e:HTMLElement;
        e = document.getElementById(id);
        return e;
    }

    getElementByEvent(evt:Event):HTMLElement
    {
        return <HTMLElement>evt.target;
    }

    requestGET(url:string, listener:GETResponseListener):void
    {
        let xhr: XMLHttpRequest;
        xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4)
            {
                if(xhr.status == 200)
                {
                    listener.handleGETResponse(xhr.status, xhr.responseText);
                }
                else
                {
                    listener.handleGETResponse(xhr.status, null);
                }
            }
        };

        xhr.open('GET', url, true);
        xhr.send(null);
    }

    requestPOST(url:string, data:object, listener:POSTResponseListener):void
    {
        let xhr: XMLHttpRequest;
        xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4)
            {
                if(xhr.status == 200)
                {
                    listener.handlePOSTResponse(xhr.status, xhr.responseText);
                }
                else
                {
                    listener.handlePOSTResponse(xhr.status, null);
                }
            }
        };

        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); 
        xhr.send(JSON.stringify(data));
    }

    requestDELETE(url:string, data:object, listener:POSTResponseListener):void
    {
        let xhr: XMLHttpRequest;
        xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4)
            {
                if(xhr.status == 200)
                {
                    listener.handlePOSTResponse(xhr.status, xhr.responseText);
                }
                else
                {
                    listener.handlePOSTResponse(xhr.status, null);
                }
            }
        };

        xhr.open('DELETE', url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); 
        xhr.send(JSON.stringify(data));
        console.log(data);
    }
}