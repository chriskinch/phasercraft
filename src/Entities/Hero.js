import { getSpellSchools, getAssendedClass } from '../Config/ClassConfig'

export default class Hero {
	
	constructor(options) {
		const { name, primary_class, secondary_class } = options;

		this.name = name;
		this.type = this.setClass([primary_class, secondary_class]);
		this.spell_schools = this.setSpellSchools();
		this.assended = false;

		this.assendClass = this.assendClass.bind(this);
	}

    setClass(types){
    	return (types[1]) ? getAssendedClass(types) : types[0];
    }

    setSpellSchools(){
    	return getSpellSchools(this.type);
    }

    assendClass(type){
    	if(!this.assended) {
	    	this.type = this.setClass([this.type, type]);
	    	this.spell_schools = this.setSpellSchools();
	    	this.assended = true;
	    }
    }

    preload(){
        
    }

    create(){

    }
}