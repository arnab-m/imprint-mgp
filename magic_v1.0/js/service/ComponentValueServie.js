'use strict';
var docType = angular.module('componentTypeService', []);
docType.value('ComponentTypes',{
	componentList : [
		
		{name : 'Solar PV Panel',type : 'PV_GridTie',id:'1',properties : [{name : 'Np',value:'100'},{name : 'moduleData',value:'moduleData'},{name : 'useConstantIrradiance',value:'false'}],namespace : 'MicroGrid.OnePhase.Sources.PV_GridTie',terminal:['Irradiance_input','V_out','pin_out'],subComponent:[],icon : 'img\\solarpanel.png'},
		{name : 'Wind Power Plant',type : 'WindPowerPlant',id:'2',properties : [{name : 'n',value:'48'}],namespace : 'MicroGrid.OnePhase.Sources.WindPowerPlant',terminal:['WindVelocity','V_out','pin_P1'],subComponent:[],icon : 'img\\WindTurbine.png'},
		{name : 'MainGrid',type : 'MainGrid',id:'3',properties : [{name : 'V',value:'440'}],namespace : 'MicroGrid.OnePhase.Sources.PowerSource',terminal:['P_in','v_out','terminal'],subComponent:[],icon : 'img\\GasTurbine.png'},
		{name : 'Generator',type : 'Generator',id:'4',properties : [{name : 'P_Capacity',value:''},{name : 'P_in',value:''}],namespace : 'MicroGrid.OnePhase.Sources.PowerSource',terminal:['V_out','pin_P1'],subComponent:[],icon : 'img\\Generator.png'},

		{name : 'Irradiance',type : 'irradiance',id:'5',properties : [{name : 'k',value:'800'}], namespace : 'Modelica.Blocks.Sources.Constant',terminal:['y'],subComponent:[]},
		{name : 'WindVelocity',type : 'WindVelocity',id:'6',properties : [{name : 'k',value:'25'}], namespace : 'Modelica.Blocks.Sources.Constant',terminal:['y'],subComponent:[]},
		{name : 'GridCapacity',type : 'GridCapacity',id:'7',properties : [{name : 'k',value:'77000'}], namespace : 'Modelica.Blocks.Sources.Constant',terminal:['y'],subComponent:[]},

		{name : 'Bus Bar',type : 'BusBar',id:'8',properties : [{name : 'n',value:'1'}], namespace : 'MicroGrid.Interfaces.OnePhase.BusBar',terminal:['pin_P','pin_N','V_in','V_out'],subComponent:[]},
		{name : 'Transformer',type : 'TransformerBasic',id:'9',properties : [{name : 'TurnsRatio',value:'14.67'}], namespace : 'MicroGrid.OnePhase.Components.Transformers.TransformerBasic',terminal:['terminal_in','terminal_out','V_in','V_out'],subComponent:[]},
		{name : 'Circuit Breaker',type : 'CircuitBreaker',id:'10',properties : [{name : 'Cut',value:'20'}], namespace : 'MicroGrid.OnePhase.Components.Breaker.CircuitBreaker',subComponent:[]},

		{name : 'Feeder Tie',type : 'FeederTie',id:'11',properties : [],namespace : 'MicroGrid.OnePhase.Components.Switch.FeederTie',terminal:[],subComponent:[]},
		{name : 'Feeder',type : 'Feeder',id:'12',properties : [],namespace : 'MicroGrid.OnePhase.Components.Transmission.NewFeeder',terminal:[],subComponent:[]},
		
		{name : 'Boolean Pulse',type : 'BooleanPulse',id:'13',properties : [{name : 'width',value:''}],namespace : 'Modelica.Blocks.Sources.Constant',terminal:['y'],subComponent:[]},
		{name : 'Load',type : 'Resistive',id:'14',properties : [],namespace : 'MicroGrid.OnePhase.Components.Load.Resistive',terminal:['terminal','V_in','Y'],subComponent:[]},
		{name : 'Building Load',type : 'Building_load',id:'15',properties : [], namespace : 'MicroGrid.Examples.OnePhase.Building_load',subComponent:[]}
		// {name : 'Grid Tie',type : 'PV_GridTie',id:'14',properties : [{name : 'Np',value:'100'},{name : 'moduleData',value:'moduleData'},{name : 'useConstantIrradiance',value:'false'}], namespace : 'MicroGrid.OnePhase.Sources.PV_GridTie',terminal:['pin_P','pin_N','V_in','V_out'],subComponent:[]},
		// {name : 'Module Data',type : 'ModuleData',id:'14',properties : [{name : 'ImpRef',value:'7.61'},{name : 'IscRef',value:'8.21'},{name : 'VmpRef',value:'26.3'},{name : 'VocRef',value:'32.9'},{name : 'alphaIsc',value:'3.18e-3'},{name : 'alphaVoc',value:'-0.123'},{name : 'ns',value:'54'}], namespace : 'parameter MicroGrid.DC.PhotoVoltaics.Records.ModuleData',subComponent:['SubComponentA','SubComponentB','SubComponentC']},
		// {name : 'Sensor',type : 'Sensor',id:'5',properties : [],namespace :'MicroGrid.OnePhase.Components.Sensor.Sensor',terminal:[],subComponent:[],icon : 'img\\sensor.png'},
		],
linkList :['pin_P','pin_N','V_in','V_out','N','P','terminal','y','Y','Irradiance_input','terminal_out','terminal_in','pin_P1','WindVelocity']

});


