import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function show_alert(mensaje: string,icono: any ,foco = ''){
    onfocus(foco);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title:mensaje,
        icon:icono
    })
}

function onfocus(foco: string){
    if(foco !==''){
        document.getElementById(foco)?.focus();
    }
}