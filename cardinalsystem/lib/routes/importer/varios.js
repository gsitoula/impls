new_split = split_it[0].split('\n');
		//console.log(new_split);
		
		split_it.forEach((objs) => {
			console.log(objs);

			my_model = {
				"nombre": objs,
				"apellido": objs,
				"edad": objs,
				"dni": objs,
				"direccion": objs
			}

			console.log(my_model);

			data.collection('esquemas').find({nombre_esquema: "test_campana"})
			.toArray((err, result) => {
				//console.log("esquema en db: " + result[0].esquema_de_datos + "--" + objs );
				
			})
		});	


		function listarKeys(arr) {
			data.collection('esquemas').find({nombre_esquema: "test_campana"})
				.toArray((err, result) => {
					if(err) return err;
						arr.push(result[0]);
						return arr;
				});
		};
		console.log(listarKeys(obj_key));

		//console.log(my_model); 
		arr_obj_val.push(my_model);

		arr_obj_val.forEach((each, index) => {
			if(index != 0) {
				//console.log(each);
				arr_model.push(each);
			}
		});

		console.log(schema[0].esquema_de_datos);
				/*
				var obj_my_keys = {
					key_1: "nombre",
					key_2: "apellido",
					key_3: "edad",
					key_4: "dni",
					key_5: "direccion"
				};*/
obj = {
						key_1: "nombre",
						key_2: "apellido",
						key_3: "edad",
						key_4: "dni",
						key_5: "direccion"
				};
				console.log(obj);
				return obj;	

				//makeDataModel = function(obj) {
					//}		

			//console.log(makeDataModel(obj_my_keys));

			//makeDataModel(obj_my_keys);
			/*
				my_model = {
					[obj_my_keys.key_1]: split_it[0],
					[obj_my_keys.key_2]: split_it[1],
					[obj_my_keys.key_3]: split_it[2],
					[obj_my_keys.key_4]: split_it[3],
					[obj_my_keys.key_5]: split_it[4]
				}*/

				split_it[0],
split_it[1],
split_it[2],
split_it[3],
split_it[4] 

data.collection('esquemas').find({nombre_esquema: "test_campana"})
				.toArray((err, schema) => {
					if(err) {
						console.log(err);
						return;
					}
				//console.log(obj);	
				//console.log(schema[0].esquema_de_datos._o1);
				var my_obj = {
					[schema[0].esquema_de_datos._o1]: split_it[0],
					[schema[0].esquema_de_datos._o2]: split_it[1],
					[schema[0].esquema_de_datos._o3]: split_it[2],
					[schema[0].esquema_de_datos._o4]: split_it[3],
					[schema[0].esquema_de_datos._o5]: split_it[4]
				}
				//console.log(my_obj);
				arr_model.push(my_obj);
				my_obj = {};
				//console.log(arr_model);
				/*
				data.collection('datos_importados').save(my_obj, function(err, result){
  				//console.log(result);
  					if(err){
  						console.log(err);
  						res.status(501).send({status:501, descripcion: "Ocurrio un error."});
  						return;
  					}
  				});*/
			});

							function readArrModel(arrIn, arrOut){
				arrIn.forEach((info, index) => {
					//console.log(info);
					
				});
			};
			readArrModel(arr_model);
			
			arr_model.forEach((info, index) => {
				//console.log(info);
			data.collection('esquemas').find({nombre_esquema: "test_campana"})
				.toArray((err, schema) => {
					//console.log(schema[0].esquema_de_datos);
					//console.log(info[0]);
					var obj = {
						[schema[0].esquema_de_datos._o1]: info[0],
						[schema[0].esquema_de_datos._o2]: info[1],
						[schema[0].esquema_de_datos._o3]: info[2],
						[schema[0].esquema_de_datos._o4]: info[3],
						[schema[0].esquema_de_datos._o5]: info[4]
					};
					//console.log(obj);
					my_model_arr.push(obj);
					
					data.collection('campanas_potenciales').save({ campana: "test_campana", contactos: my_model_arr}, function(err, result){
  						//console.log(result);
  					if(err){
  						console.log(err);
  						res.status(501).send({status:501, descripcion: "Ocurrio un error."});
  						return;
  					}
  					})		
				});
			});