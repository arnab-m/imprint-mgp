#!/usr/bin/python
from __future__ import print_function

import sys
import random

import cplex
from cplex.exceptions import CplexError
# import pandas as pd
import numpy as np
import csv

#Loading Data

T,alpha, eta_c, eta_d, gamma_b = 10, 10, .95, .98, 2
rho_b_t = [random.randint(5,20) for t in range(T)]
rho_s_t = [random.randint(3,15) for t in range(T)]
RU, RD= 500, 500 #in kw
E_max = 1000 # in kwh
P_DG_min, P_DG_max = 500, 2500
P_DG_init = 1000
P_MG_min, P_MG_max = 0, 5000
P_B_min, P_B_max  = 0, 1000
SOC_init, SOC_final = 50,50
SOC_min, SOC_max = 20, 100

P_PV_t = [random.randint(1000,1500) for t in range(T)] #PV Generation
P_WT_t = [random.randint(1500,2500) for t in range(T)] #Wind Generation
P_L_t = [random.randint(3000,5000) for t in range(T)]#Load

#-------------------------------------------------------
#Decision variable names
#Diesel generator P_DG_t for all t
P_DG = ["P_DG_"+str(t) for t in range(T)]
#Main grid buy and sell P_MG_b_t and P_MG_s_t for all t
P_MG_b = ["P_MG_b_"+str(t) for t in range(T)]
P_MG_s = ["P_MG_s_"+str(t) for t in range(T)]
#Main grid buy and sell status variables, These are binary variables
S_MG_b = ["S_MG_b_"+str(t) for t in range(T)]
S_MG_s = ["S_MG_s_"+str(t) for t in range(T)]
#Linearizing variable for the terms (S_MG_b_t*P_MG_b_t) and (S_MG_s_t*P_MG_s_t)
SP_MG_b = ["SP_MG_b_"+str(t) for t in range(T)]
SP_MG_s = ["SP_MG_s_"+str(t) for t in range(T)]
#Battery Charge and Discharge P_B_dch_t and P_B_ch_t
P_B_dch = ["P_B_dch_"+str(t) for t in range(T)]
P_B_ch = ["P_B_ch_"+str(t) for t in range(T)]
#Battery status variables, These are binary variables
S_B_dch = ["S_B_dch_"+str(t) for t in range(T)]
S_B_ch = ["S_B_ch_"+str(t) for t in range(T)]
#Linearizing variable for the terms (S_B_dch_t*P_B_dch_t) and (S_B_ch_t*P_B_ch_t)
SP_B_dch= ["SP_B_dch_"+str(t) for t in range(T)]
SP_B_ch= ["SP_B_ch_"+str(t) for t in range(T)]
#State of charge SOC_t for all t
SOC = ["SOC_"+str(t) for t in range(T)]
my_colnames = P_DG + P_MG_b + P_MG_s + S_MG_b + S_MG_s + SP_MG_b + SP_MG_s
my_colnames+= P_B_dch + P_B_ch + S_B_dch+ S_B_ch + SP_B_dch+ SP_B_ch + SOC
#---------------------------------------------------------
#Coefficients of the Objective 
my_obj = []
#Diesel generator cost coefficient alpha  for all t
my_obj += [alpha for t in range(T)]

#Main grid buy and sell prices at different times 
my_obj += [0 for t in range(T)]#buy
my_obj += [0 for t in range(T)]#sell
#for the status variables
my_obj += [0 for t in range(T)]#buy
my_obj += [0 for t in range(T)]#sell
#for the variable SP_MG_b_t and SP_MG_s_t, ie, for the terms (S_MG_b_t*P_MG_b_t) and (S_MG_s_t*P_MG_s_t)
my_obj += [rho_b_t[t] for t in range(T)]
my_obj += [-1*rho_s_t[t] for t in range(T)]

#Battery depreciation cost
my_obj += [0 for t in range(T)]#discharge
my_obj += [0 for t in range(T)]#charge
#for the status variables
my_obj += [0 for t in range(T)]#discharge
my_obj += [0 for t in range(T)]#charge
#for the variables SP_B_dch_t and SP_B_ch_t
my_obj += [gamma_b for t in range(T)]
my_obj += [gamma_b for t in range(T)]
#State of charge variable has no contibution to the objective
my_obj += [0 for t in range(T)]
#------------------------------------------------------------
#Upper and Lower Bounds of the decision variables
my_ub, my_lb = [], []
#Diesel Generator maximum and minimum generation bounds
my_ub += [P_DG_max for t in range(T)]
my_lb += [P_DG_min for t in range(T)]
#Maximum and minimum power buy and sell from Main grid
my_ub += [P_MG_max for t in range(T)] #Buying power limits
my_lb += [P_MG_min for t in range(T)]
my_ub += [P_MG_max for t in range(T)] #Selling power limits
my_lb += [P_MG_min for t in range(T)]
#for the Status variables S_MG_b_t and S_MG_s_t
my_ub += [1 for t in range(T)] #Buying
my_lb += [0 for t in range(T)]
my_ub += [1 for t in range(T)] #Selling
my_lb += [0 for t in range(T)]
#for the terms SP_MG_b_t and SP_MG_s_t
my_ub += [P_MG_max for t in range(T)] #Buying power limits
my_lb += [P_MG_min for t in range(T)]
my_ub += [P_MG_max for t in range(T)] #Selling power limits
my_lb += [P_MG_min for t in range(T)]

#Battery Charging and discharging power limits
my_ub += [P_B_max for t in range(T)] #discharging power limits
my_lb += [P_B_min for t in range(T)]
my_ub += [P_B_max for t in range(T)] #charging power limits
my_lb += [P_B_min for t in range(T)]
#for the status variables S_B_dch_t and S_B_ch_t
my_ub += [1 for t in range(T)] #discharging power limits
my_lb += [0 for t in range(T)]
my_ub += [1 for t in range(T)] #charging power limits
my_lb += [0 for t in range(T)]
#for the terms SP_B_dch_t and SP_B_ch_t
my_ub += [P_B_max for t in range(T)] #discharging power limits
my_lb += [P_B_min for t in range(T)]
my_ub += [P_B_max for t in range(T)] #charging power limits
my_lb += [P_B_min for t in range(T)]
#State of charge can be between 20% to 100%
my_ub += [SOC_max for t in range(T)]
my_lb += [SOC_min for t in range(T)]
#-----------------------------------------------------------------

#Type of the decision variables, Integer "I", Binary "B", and Continous "C"
my_ctype = ""
#Diesel generator Power
my_ctype += "I"*T
#Main grid buy and sell power
my_ctype += "I"*T #Buying
my_ctype += "I"*T #Selling
my_ctype += "B"*T #Buying status
my_ctype += "B"*T #Selling status
my_ctype += "I"*T #product term Buying and status
my_ctype += "I"*T #product term Selling and status
#Battery discharging and charging power
my_ctype += "I"*T #discharging
my_ctype += "I"*T #charging
my_ctype += "B"*T #discharging status
my_ctype += "B"*T #charging status
my_ctype += "I"*T #product term discharging and status
my_ctype += "I"*T #product term charging and status 
#State of charge is a integer decision variable 
my_ctype += "I"*T

#Preparing constraints
my_rownames, my_rhs, my_sense, rows = [],[],"",[]

#Power Balance constraint, at every time slot t
for t in range(T):
	my_rownames+= ["Power_Balance_"+str(t)]
	my_rhs += [P_L_t[t]-(P_PV_t[t]+P_WT_t[t])] #Load - (PV + WT generation)
	my_sense +="G"
	var = ["P_DG_"+str(t), "SP_MG_b_"+str(t), "SP_MG_s_"+str(t), "SP_B_dch_"+str(t), "SP_B_ch_"+str(t)]
	coef = [1,1,-1,1,-1]
	rows.append([var,coef])
#Ramp up and down limits of the diesel generator
# For the First Hour
my_rownames += ["RU_"+str(0), "RD_"+str(0)]
my_rhs += [RU+P_DG_init ,P_DG_init-RD] #Ramp up and down limit
my_sense +="LG"
var = ["P_DG_"+str(0)]
coef = [1]
rows.append([var,coef])#Ramp UP
var = ["P_DG_"+str(0)]
coef = [1]
rows.append([var,coef])#Ramp down
#For the hour second and so on till last
for t in range(1,T):
	#Ramp up
	my_rownames += ["RU_"+str(t), "RD_"+str(t)]
	my_rhs += [RU,RD] #Ramp up and down limit
	my_sense +="LL"
	var = ["P_DG_"+str(t), "P_DG_"+str(t-1)]
	coef = [1,-1]
	rows.append([var,coef])#Ramp UP
	var = ["P_DG_"+str(t), "P_DG_"+str(t-1)]
	coef = [-1,1]
	rows.append([var,coef])#Ramp down

#Battery State of charge constraint
#For the first hour
my_rownames+= ["SOC_"+str(0)]
my_rhs += [SOC_init] #
my_sense += "E"
var = ["SOC_"+str(0)]
coef = [1]
rows.append([var,coef])
for t in range(1,T):
	my_rownames+= ["SOC_"+str(t)]
	my_rhs += [0] #
	my_sense += "E"
	var = ["SOC_"+str(t), "SOC_"+str(t-1),"SP_B_dch_"+str(t-1), "SP_B_ch_"+str(t-1)]
	coef = [1, -1, round(100/(eta_d*E_max),2), round((-100*eta_c)/E_max,2)]
	rows.append([var,coef])
#Constraint: charge or discharge but not both in a time slot
for t in range(0,T):
	my_rownames+= ["Ch_or_Dch_"+str(t)]
	my_rhs += [1] #
	my_sense += "L"
	var = ["S_B_dch_"+str(t), "S_B_ch_"+str(t)]
	coef = [1, 1]
	rows.append([var,coef])
#Constraint: Main grid buy or sell, but not both in a time slot
for t in range(0,T):
	my_rownames+= ["Buy_or_Sell_"+str(t)]
	my_rhs += [1] #
	my_sense += "L"
	var = ["S_MG_b_"+str(t), "S_MG_s_"+str(t)]
	coef = [1, 1]
	rows.append([var,coef])
#list of linear variables representing the non-linear terms
non_lin_vars, lin_vars, lin_vars_min, lin_vars_max, status_vars = [], [], [], [], []
for t in range(0, T):
	non_lin_vars += ["SP_MG_b_"+str(t), "SP_MG_s_"+str(t), "SP_B_dch_"+str(t), "SP_B_ch_"+str(t)]
	lin_vars += ["P_MG_b_"+str(t), "P_MG_s_"+str(t), "P_B_dch_"+str(t), "P_B_ch_"+str(t)]
	lin_vars_min += [P_MG_min, P_MG_min, P_B_min, P_B_min]
	lin_vars_max += [P_MG_max, P_MG_max, P_B_max, P_B_max]
	status_vars += ["S_MG_b_"+str(t), "S_MG_s_"+str(t), "S_B_dch_"+str(t), "S_B_ch_"+str(t)]
#Linearizing Constraints
for x,y,z,ymin,ymax in zip(status_vars, lin_vars, non_lin_vars, lin_vars_min, lin_vars_max):
	#Constraint 1: z <= x*ymax
	my_rownames+= ["C1_"+z]
	my_rhs += [0] #
	my_sense += "L"
	var = [z, x]
	coef = [1, -1*ymax]
	rows.append([var,coef])
	#Constraint 2: z <= y
	my_rownames+= ["C2_"+z]
	my_rhs += [0] #
	my_sense += "L"
	var = [z, y]
	coef = [1, -1]
	rows.append([var,coef])
	#Constraint 3: z >= y - (1-x)*ymax
	my_rownames+= ["C3_"+z]
	my_rhs += [-1*ymax] 
	my_sense += "G"
	var = [z, y, x]
	coef = [1, -1, -1*ymax]
	rows.append([var,coef])

# print(len(my_obj), len(my_lb), len(my_ub), len(my_ctype), len(my_colnames))
# print(len(rows), len(my_sense), len(my_rhs), len(my_rownames))

#Creating a CPLEX object
my_prob = cplex.Cplex()
#Setting the objective function as Minimize
my_prob.objective.set_sense(my_prob.objective.sense.minimize)
#Adding variables and their specifications
my_prob.variables.add(obj=my_obj, lb=my_lb, ub=my_ub, types=my_ctype, names=my_colnames)
#Adding constraints
my_prob.linear_constraints.add(lin_expr=rows, senses=my_sense, rhs=my_rhs, names=my_rownames)
my_prob.write("Scheduler.lp")
#Solving...
my_prob.solve()
print("Solution value  = ", my_prob.solution.get_objective_value())

numcols = my_prob.variables.get_num()
numrows = my_prob.linear_constraints.get_num()

slack = my_prob.solution.get_linear_slacks()
x = my_prob.solution.get_values()


# for j in range(numcols):
#     print("%s:%10f" % (my_colnames[j], x[j]))
my_prob.write("Scheduler.lp")
my_colnames = P_DG + P_MG_b + P_MG_s + S_MG_b + S_MG_s + SP_MG_b + SP_MG_s
my_colnames+= P_B_dch + P_B_ch + S_B_dch+ S_B_ch + SP_B_dch+ SP_B_ch + SOC
P_DG_values = my_prob.solution.get_values(P_DG)
P_MG_b_values = my_prob.solution.get_values(P_MG_b)
P_MG_s_values = my_prob.solution.get_values(P_MG_s)
P_B_dch_values = my_prob.solution.get_values(P_B_dch)
P_B_ch_values = my_prob.solution.get_values(P_B_ch)
SOC_values = my_prob.solution.get_values(SOC)
#-------------------
#Writing Data to a file
with open("data.csv", "w") as csvfile:
	writerobj = csv.writer(csvfile, delimiter=',')
	writerobj.writerow(["TSlt", "PV_Gen", "WT_Gen", "Load", "DG_Gen", "MG_buy", "MG_sell", "Bat_dch", "Bat_ch", "SOC"])
	for t in range(T):
		writerobj.writerow([t+1, P_PV_t[t], P_WT_t[t], P_L_t[t], round(P_DG_values[t]), round(P_MG_b_values[t]), round(P_MG_s_values[t]), round(P_B_dch_values[t]), round(P_B_ch_values[t]), round(SOC_values[t])])
	writerobj.writerow(["solution", my_prob.solution.get_objective_value()])
