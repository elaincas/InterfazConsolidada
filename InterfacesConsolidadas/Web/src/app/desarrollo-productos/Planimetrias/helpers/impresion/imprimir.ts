export module ImprimirDocumento{
    var capturador;
    export function print(htmlString: string)
    {          
        var head =  `<html>
                        <head>
                            <title>Reporte</title>
                        </head>
                        <body> 
                            @Data 
                        <script> 
                            var listo = false; 
                
                            setInterval(function(){
                                if(listo == false){ 
                                    window.print(); 
                                    listo = true;
                                };
                            }, 1000);  
                        </script>
                        </body>
                    </html>`;


        var mywindow = window.open('', 'blank', 'height=800,width=1000');
        head = head.replace("@Data", htmlString);
        mywindow.document.write(head);
        mywindow.focus();

        let tmp = `
        <script> 
            var listo = false; 

            setInterval(function(){ 
                if(document.readyState=="complete" && listo == false){ 
                    window.print(); 
                    listo = true;
                };
            }, 1000);  
        </script> `
    }  
      
}
