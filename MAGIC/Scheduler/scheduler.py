#!/usr/bin/python
from __future__ import print_function

import sys
import random

import cplex
from cplex.exceptions import CplexError

#Loading Data

T,alpha, eta_c, eta_d, gamma_b = 6, 10, .95, .98, 1
rho_b_t = [random.randint(3,16) for t in range(T)]
rho_s_t = [random.randint(3,16) for t in range(T)]
RU, RD= 500, 500 #in kw
E_max = 5000 # in kwh
P_DG_min, P_DG_max = 500, 4000
P_DG_init = 1000
P_MG_min, P_MG_max = 100, 2000
P_B_max, P_B_min = 1000, 0
SOC_init, SOC_final = 50,50
SOC_min, SOC_max = 20, 100

P_PV_t = [random.randint(100,150) for t in range(T)] #PV Generation
P_WT_t = [random.randint(150,250) for t in range(T)] #Wind Generation
P_L_t = [random.randint(3000,4000) for t in range(T)]#Load

#-------------------------------------------------------
#Decision variable names
my_colnames = []
#Diesel generator P_DG_t for all t
my_colnames += ["P_DG_"+str(t) for t in range(T)]
#Main grid buy and sell P_MG_b_t and P_MG_s_t for all t
my_colnames += ["P_MG_b_"+str(t) for t in range(T)]
my_colnames += ["P_MG_s_"+str(t) for t in range(T)]
#Battery Charge and Discharge P_B_dch_t and P_B_ch_t
my_colnames += ["P_B_dch_"+str(t) for t in range(T)]
my_colnames += ["P_B_ch_"+str(t) for t in range(T)]
#State of charge SOC_t for all t
my_colnames += ["SOC_"+str(t) for t in range(T)]
#---------------------------------------------------------
#Coefficients of the Objective 
my_obj = []
#Diesel generator cost coefficient alpha  for all t
my_obj += [alpha for t in range(T)]
#Main grid buy and sell prices at different times
my_obj += [rho_b_t[t] for t in range(T)]
my_obj += [-1*rho_s_t[t] for t in range(T)]
#Battery depreciation cost
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
#Battery Charging and discharging power limits
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
#Battery discharging and charging power
my_ctype += "I"*T #discharging
my_ctype += "I"*T #charging
#State of charge is a integer decision variable 
my_ctype += "I"*T

#Preparing constraints
my_rownames, my_rhs, my_sense, rows = [],[],"",[]

#Power Balance constraint, at every time slot t
for t in range(T):
	my_rownames+= ["Power_Balance_"+str(t)]
	my_rhs += [P_L_t[t]-(P_PV_t[t]+P_WT_t[t])] #Load - (PV + WT generation)
	my_sense +="G"
	var = ["P_DG_"+str(t), "P_MG_b_"+str(t), "P_MG_s_"+str(t), "P_B_dch_"+str(t), "P_B_ch_"+str(t)]
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
	var = ["SOC_"+str(t), "SOC_"+str(t-1),"P_B_dch_"+str(t-1), "P_B_ch_"+str(t-1)]
	coef = [1, -1, 1/(eta_d*E_max), (-1*eta_c)/E_max]
	rows.append([var,coef])

# #Power Limits of all the generators
# for t in range(T):
# 	#Diesel Limits
# 	my_rownames+= ["DG_min_"+str(t), "DG_max_"+str(t)]
# 	my_rhs += [P_DG_min, P_DG_max] #
# 	my_sense += "GL"
# 	var = ["P_DG_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#Diesel Minimum Limit
# 	var = ["P_DG_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#Diesel Maximum Limit
# 	#Main Grid Limits
# 	my_rownames+= ["MG_buy_min_"+str(t), "MG_buy_max_"+str(t), "MG_sell_min_"+str(t), "MG_sell_max_"+str(t)]
# 	my_rhs += [P_MG_min, P_MG_max, P_MG_min, P_MG_max] #
# 	my_sense += "GLGL"
# 	var = ["P_MG_b_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#MG buy Minimum Limit
# 	var = ["P_MG_b_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#MG buy Maximum Limit
# 	var = ["P_MG_s_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#MG sell Minimum Limit
# 	var = ["P_MG_s_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#MG sell Maximum Limit
# 	#Battery power Limits
# 	my_rownames+= ["Bat_dch_min_"+str(t), "Bat_dch_max_"+str(t), "Bat_ch_min_"+str(t), "Bat_ch_max_"+str(t)]
# 	my_rhs += [P_B_min, P_B_max, P_B_min, P_B_max] #
# 	my_sense += "GLGL"
# 	var = ["P_B_dch_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#MG buy Minimum Limit
# 	var = ["P_B_dch_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#MG buy Maximum Limit
# 	var = ["P_B_ch_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#MG sell Minimum Limit
# 	var = ["P_B_ch_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#MG sell Maximum Limit
# 	#SOC limits
# 	my_rownames+= ["SOC_min_"+str(t), "SOC_max_"+str(t)]
# 	my_rhs += [SOC_min, SOC_max] #
# 	my_sense += "GL"
# 	var = ["SOC_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#SOC minimum Limit
# 	var = ["SOC_"+str(t)]
# 	coef = [1]
# 	rows.append([var,coef])#SOC maximum

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
#Solving...
my_prob.solve()
print("Solution value  = ", my_prob.solution.get_objective_value())

numcols = my_prob.variables.get_num()
numrows = my_prob.linear_constraints.get_num()

slack = my_prob.solution.get_linear_slacks()
x = my_prob.solution.get_values()

# for j in range(numrows):
#     print("Row %d:  Slack = %10f" % (j, slack[j]))
for j in range(numcols):
    print("%s:%10f" % (my_colnames[j], x[j]))
my_prob.write("Scheduler.lp")

# def populatebyrow(prob):
#     prob.objective.set_sense(prob.objective.sense.maximize)

#     prob.variables.add(obj=my_obj, lb=my_lb, ub=my_ub, types=my_ctype,
#                        names=my_colnames)

#     rows = [[["x1", "x2", "x3", "x4"], [-1.0, 1.0, 1.0, 10.0]],
#             [["x1", "x2", "x3"], [1.0, -3.0, 1.0]],
#             [["x2", "x4"], [1.0, -3.5]]]

#     prob.linear_constraints.add(lin_expr=rows, senses=my_sense,
#                                 rhs=my_rhs, names=my_rownames)


# def populatebycolumn(prob):
#     prob.objective.set_sense(prob.objective.sense.minimize)

#     prob.linear_constraints.add(rhs=my_rhs, senses=my_sense,
#                                 names=my_rownames)

#     c = [[["r1", "r2"], [-1.0, 1.0]],
#          [["r1", "r2"
#          , "r3"], [1.0, -3.0, 1.0]],
#          [["r1", "r2"], [1.0, 1.0]],
#          [["r1", "r3"], [10.0, -3.5]]]

#     prob.variables.add(obj=my_obj, lb=my_lb, ub=my_ub,
#                        names=my_colnames, types=my_ctype, columns=c)


# def populatebynonzero(prob):
#     prob.objective.set_sense(prob.objective.sense.maximize)

#     prob.linear_constraints.add(rhs=my_rhs, senses=my_sense,
#                                 names=my_rownames)
#     prob.variables.add(obj=my_obj, lb=my_lb, ub=my_ub, types=my_ctype,
#                        names=my_colnames)

#     rows = [0, 0, 0, 0, 1, 1, 1, 2, 2]
#     cols = [0, 1, 2, 3, 0, 1, 2, 1, 3]
#     vals = [-1.0, 1.0, 1.0, 10.0, 1.0, -3.0, 1.0, 1.0, -3.5]

#     prob.linear_constraints.set_coefficients(zip(rows, cols, vals))


# def mipex1(pop_method):

#     try:
#         my_prob = cplex.Cplex()

#         if pop_method == "r":
#             handle = populatebyrow(my_prob)
#         elif pop_method == "c":
#             handle = populatebycolumn(my_prob)
#         elif pop_method == "n":
#             handle = populatebynonzero(my_prob)
#         else:
#             raise ValueError('pop_method must be one of "r", "c" or "n"')

#         my_prob.solve()
#     except CplexError as exc:
#         print(exc)
#         return

#     print()
#     # solution.get_status() returns an integer code
#     print("Solution status = ", my_prob.solution.get_status(), ":", end=' ')
#     # the following line prints the corresponding string
#     print(my_prob.solution.status[my_prob.solution.get_status()])
#     print("Solution value  = ", my_prob.solution.get_objective_value())

#     numcols = my_prob.variables.get_num()
#     numrows = my_prob.linear_constraints.get_num()

#     slack = my_prob.solution.get_linear_slacks()
#     x = my_prob.solution.get_values()

#     for j in range(numrows):
#         print("Row %d:  Slack = %10f" % (j, slack[j]))
#     for j in range(numcols):
#         print("Column %d:  Value = %10f" % (j, x[j]))
#     my_prob.write("mipex.lp")
# if __name__ == "__main__":
#     if len(sys.argv) != 2 or sys.argv[1] not in ["-r", "-c", "-n"]:
#         print("Usage: mipex1.py -X")
#         print("   where X is one of the following options:")
#         print("      r          generate problem by row")
#         print("      c          generate problem by column")
#         print("      n          generate problem by nonzero")
#         print(" Exiting...")
#         sys.exit(-1)
#     mipex1(sys.argv[1][1])
