model Submodel1ph_0
MicroGrid.OnePhase.Components.Sensor.Sensor sensor1;
MicroGrid.OnePhase.Components.Sensor.Sensor sensor2;
MicroGrid.OnePhase.Components.Load.Resistive resistive11;
MicroGrid.OnePhase.Components.Load.Resistive resistive12;
Modelica.Blocks.Sources.Constant const(k=1.2);
Modelica.Blocks.Sources.Constant const1(k=1.3);
MicroGrid.OnePhase.Components.Switch.FeederTie feederTie1;
MicroGrid.OnePhase.Sources.PowerSource powerSource2(P_Capacity=0.22,P_in=aa);
MicroGrid.OnePhase.Components.Transmission.NewFeeder newFeeder1;
MicroGrid.OnePhase.Components.Transmission.NewFeeder newFeeder2;
Modelica.Blocks.Sources.BooleanPulse boolean_pulse1(width=200);
Modelica.Blocks.Sources.BooleanPulse boolean_pulse2(width=333.6698);
MicroGrid.OnePhase.Sources.PowerSource powerSource2(P_Capacity=2356,P_in=21);
equation

connect(powerSource2.terminal,sensor1.P);
connect(sensor2.N,powerSource2.terminal);
connect(newFeeder2.V_in_right,powerSource2.v_out);

connect(powerSource2.v_out,newFeeder1.V_in_left);
connect(boolean_pulse2.y,newFeeder1.control_R);
connect(boolean_pulse2.y,newFeeder1.control_L);
connect(boolean_pulse1.y,newFeeder2.control_R);
connect(boolean_pulse1.y,newFeeder2.control_R);
connect(newFeeder1.V_out,resistive11.V_in);
connect(newFeeder2.V_out,resistive12.V_in);
connect(newFeeder2.feeder,resistive12.terminal);
connect(newFeeder1.feeder,resistive11.terminal);
connect(newFeeder2.V_out,feederTie1.V_in_right);
connect(newFeeder1.V_out,feederTie1.V_in_left);
connect(newFeeder2.N,sensor2.P);
connect(newFeeder1.V_in_right,feederTie1.V_out_left);
connect(feederTie1.V_out_right,newFeeder2.V_in_left);
connect(feederTie1.N,newFeeder2.P);
connect(newFeeder1.N,feederTie1.P);
connect(feederTie1.N,newFeeder2.P);
connect(sensor1.N,newFeeder1.P);
connect(sensor1.I,feederTie1.Left);
connect(sensor2.I,feederTie1.Right);
connect(const1.y,resistive12.Y);
connect(const.y,resistive11.Y);
endSubmodel1ph_0;


connect(newFeeder2.V_in_right,powerSource2.v_out);
connect(newFeeder2.V_out,resistive12.V_in);
connect(newFeeder2.feeder,resistive12.terminal);
connect(newFeeder2.V_out,feederTie1.V_in_right);
connect(newFeeder2.N,sensor2.P);


connect(boolean_pulse1.y,newFeeder2.control_R);
connect(boolean_pulse1.y,newFeeder2.control_R);
connect(feederTie1.V_out_right,newFeeder2.V_in_left);
connect(feederTie1.N,newFeeder2.P);
connect(feederTie1.N,newFeeder2.P);

