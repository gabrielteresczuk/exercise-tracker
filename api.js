
class DatosArray {

    constructor(){
        this.elementos = [];
    }

    proximoID = (arr) =>{
        if(arr.length > 0){
            let ids = arr.map(el => el._id);
            const max = Math.max.apply(null, ids);
            return max+1;
        }else{
            return 1;
        }
    }

    guardar = (obj) =>{
        try {
            let datos = this.listarTodo();
            let proximoId = this.proximoID(datos);
            obj = {...obj,_id:proximoId,count:0,log:[]};
            this.elementos.push(obj);
            return proximoId;
        } catch (error) {
            console.log('Guardar - ocurrio un error: ' + error);
        }
    }

    listarPorId = (_id,from,to,limit) =>{
        try {
            let producto = this.elementos.find(el => el._id === _id);
            if(producto === undefined){
                return null;
            }

            if(from){
                let fromtime = new Date(from).getTime();
                let filterfrom = producto.log.filter(el => {return (new Date(el.date).getTime()) >= fromtime});
                producto = {...producto,from:new Date(fromtime).toDateString(),log:filterfrom}
            }

            if(to){
                let totime = new Date(to).getTime();
                let filterto = producto.log.filter(el => {return (new Date(el.date).getTime()) <= totime});
                producto = {...producto,to:new Date(totime).toDateString(),log:filterto}
            }

            if(limit){
                let limite = producto.log.filter((el,index) => index < limit);
                producto = {...producto,log:limite}
            }

            producto = {...producto,count:producto.log.length}

            return producto;

        } catch (error) {
            return 'ListarPorId - No se pudo consultar:'+error;
        }
    }



    guardarExcercise = (_id,date,duration,description) =>{
        try {
            let user = this.listarPorId(_id);
            let newUser = {...user,count: user.count+1};

            newUser.log.unshift({
                "date": date,
                "duration": parseInt(duration),
                "description": description
            });

            let newDb = this.elementos.map(el => el._id === _id ? newUser : el);

            this.elementos = [...newDb];

            return ({
                "_id": _id.toString(),
                "username": user.username,
                "date": date,
                "duration": parseInt(duration),
                "description": description
            });
        } catch (error) {
            console.log('Guardar Excercise - ocurrio un error: ' + error);
        }
    }


    listarTodoUsers = () =>{
        try {

            let users = this.elementos.map(el => ({_id:el._id.toString(), username:el.username}));
            return users;

        } catch (error) {
            return [];
        }
    }

    listarTodo = () =>{
        try {
            return [...this.elementos];
        } catch (error) {
            return [];
        }
    }

}


module.exports = DatosArray;