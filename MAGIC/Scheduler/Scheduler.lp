\ENCODING=ISO-8859-1
\Problem name: 

Minimize
 obj1: 10 P_DG_0 + 10 P_DG_1 + 10 P_DG_2 + 10 P_DG_3 + 10 P_DG_4 + 10 P_DG_5
       + 10 P_DG_6 + 10 P_DG_7 + 10 P_DG_8 + 10 P_DG_9 + 11 SP_MG_b_0
       + 17 SP_MG_b_1 + 6 SP_MG_b_2 + 12 SP_MG_b_3 + 9 SP_MG_b_4 + 17 SP_MG_b_5
       + 18 SP_MG_b_6 + 20 SP_MG_b_7 + 8 SP_MG_b_8 + 12 SP_MG_b_9
       - 13 SP_MG_s_0 - 4 SP_MG_s_1 - 5 SP_MG_s_2 - 3 SP_MG_s_3 - 4 SP_MG_s_4
       - 8 SP_MG_s_5 - 6 SP_MG_s_6 - 14 SP_MG_s_7 - 5 SP_MG_s_8 - 8 SP_MG_s_9
       + 2 SP_B_dch_0 + 2 SP_B_dch_1 + 2 SP_B_dch_2 + 2 SP_B_dch_3
       + 2 SP_B_dch_4 + 2 SP_B_dch_5 + 2 SP_B_dch_6 + 2 SP_B_dch_7
       + 2 SP_B_dch_8 + 2 SP_B_dch_9 + 2 SP_B_ch_0 + 2 SP_B_ch_1 + 2 SP_B_ch_2
       + 2 SP_B_ch_3 + 2 SP_B_ch_4 + 2 SP_B_ch_5 + 2 SP_B_ch_6 + 2 SP_B_ch_7
       + 2 SP_B_ch_8 + 2 SP_B_ch_9
Subject To
 Power_Balance_0: P_DG_0 + SP_MG_b_0 - SP_MG_s_0 + SP_B_dch_0 - SP_B_ch_0
                  >= 1017
 Power_Balance_1: P_DG_1 + SP_MG_b_1 - SP_MG_s_1 + SP_B_dch_1 - SP_B_ch_1
                  >= 678
 Power_Balance_2: P_DG_2 + SP_MG_b_2 - SP_MG_s_2 + SP_B_dch_2 - SP_B_ch_2
                  >= 1916
 Power_Balance_3: P_DG_3 + SP_MG_b_3 - SP_MG_s_3 + SP_B_dch_3 - SP_B_ch_3
                  >= 1146
 Power_Balance_4: P_DG_4 + SP_MG_b_4 - SP_MG_s_4 + SP_B_dch_4 - SP_B_ch_4
                  >= -679
 Power_Balance_5: P_DG_5 + SP_MG_b_5 - SP_MG_s_5 + SP_B_dch_5 - SP_B_ch_5
                  >= 1746
 Power_Balance_6: P_DG_6 + SP_MG_b_6 - SP_MG_s_6 + SP_B_dch_6 - SP_B_ch_6 >= 99
 Power_Balance_7: P_DG_7 + SP_MG_b_7 - SP_MG_s_7 + SP_B_dch_7 - SP_B_ch_7
                  >= 1519
 Power_Balance_8: P_DG_8 + SP_MG_b_8 - SP_MG_s_8 + SP_B_dch_8 - SP_B_ch_8
                  >= 346
 Power_Balance_9: P_DG_9 + SP_MG_b_9 - SP_MG_s_9 + SP_B_dch_9 - SP_B_ch_9
                  >= 1093
 RU_0:            P_DG_0 <= 1500
 RD_0:            P_DG_0 >= 500
 RU_1:            - P_DG_0 + P_DG_1 <= 500
 RD_1:            P_DG_0 - P_DG_1 <= 500
 RU_2:            - P_DG_1 + P_DG_2 <= 500
 RD_2:            P_DG_1 - P_DG_2 <= 500
 RU_3:            - P_DG_2 + P_DG_3 <= 500
 RD_3:            P_DG_2 - P_DG_3 <= 500
 RU_4:            - P_DG_3 + P_DG_4 <= 500
 RD_4:            P_DG_3 - P_DG_4 <= 500
 RU_5:            - P_DG_4 + P_DG_5 <= 500
 RD_5:            P_DG_4 - P_DG_5 <= 500
 RU_6:            - P_DG_5 + P_DG_6 <= 500
 RD_6:            P_DG_5 - P_DG_6 <= 500
 RU_7:            - P_DG_6 + P_DG_7 <= 500
 RD_7:            P_DG_6 - P_DG_7 <= 500
 RU_8:            - P_DG_7 + P_DG_8 <= 500
 RD_8:            P_DG_7 - P_DG_8 <= 500
 RU_9:            - P_DG_8 + P_DG_9 <= 500
 RD_9:            P_DG_8 - P_DG_9 <= 500
 SOC_0:           SOC_0  = 50
 SOC_1:           0.1 SP_B_dch_0 - 0.1 SP_B_ch_0 - SOC_0 + SOC_1  = 0
 SOC_2:           0.1 SP_B_dch_1 - 0.1 SP_B_ch_1 - SOC_1 + SOC_2  = 0
 SOC_3:           0.1 SP_B_dch_2 - 0.1 SP_B_ch_2 - SOC_2 + SOC_3  = 0
 SOC_4:           0.1 SP_B_dch_3 - 0.1 SP_B_ch_3 - SOC_3 + SOC_4  = 0
 SOC_5:           0.1 SP_B_dch_4 - 0.1 SP_B_ch_4 - SOC_4 + SOC_5  = 0
 SOC_6:           0.1 SP_B_dch_5 - 0.1 SP_B_ch_5 - SOC_5 + SOC_6  = 0
 SOC_7:           0.1 SP_B_dch_6 - 0.1 SP_B_ch_6 - SOC_6 + SOC_7  = 0
 SOC_8:           0.1 SP_B_dch_7 - 0.1 SP_B_ch_7 - SOC_7 + SOC_8  = 0
 SOC_9:           0.1 SP_B_dch_8 - 0.1 SP_B_ch_8 - SOC_8 + SOC_9  = 0
 Ch_or_Dch_0:     S_B_dch_0 + S_B_ch_0 <= 1
 Ch_or_Dch_1:     S_B_dch_1 + S_B_ch_1 <= 1
 Ch_or_Dch_2:     S_B_dch_2 + S_B_ch_2 <= 1
 Ch_or_Dch_3:     S_B_dch_3 + S_B_ch_3 <= 1
 Ch_or_Dch_4:     S_B_dch_4 + S_B_ch_4 <= 1
 Ch_or_Dch_5:     S_B_dch_5 + S_B_ch_5 <= 1
 Ch_or_Dch_6:     S_B_dch_6 + S_B_ch_6 <= 1
 Ch_or_Dch_7:     S_B_dch_7 + S_B_ch_7 <= 1
 Ch_or_Dch_8:     S_B_dch_8 + S_B_ch_8 <= 1
 Ch_or_Dch_9:     S_B_dch_9 + S_B_ch_9 <= 1
 Buy_or_Sell_0:   S_MG_b_0 + S_MG_s_0 <= 1
 Buy_or_Sell_1:   S_MG_b_1 + S_MG_s_1 <= 1
 Buy_or_Sell_2:   S_MG_b_2 + S_MG_s_2 <= 1
 Buy_or_Sell_3:   S_MG_b_3 + S_MG_s_3 <= 1
 Buy_or_Sell_4:   S_MG_b_4 + S_MG_s_4 <= 1
 Buy_or_Sell_5:   S_MG_b_5 + S_MG_s_5 <= 1
 Buy_or_Sell_6:   S_MG_b_6 + S_MG_s_6 <= 1
 Buy_or_Sell_7:   S_MG_b_7 + S_MG_s_7 <= 1
 Buy_or_Sell_8:   S_MG_b_8 + S_MG_s_8 <= 1
 Buy_or_Sell_9:   S_MG_b_9 + S_MG_s_9 <= 1
 C1_SP_MG_b_0:    - 5000 S_MG_b_0 + SP_MG_b_0 <= 0
 C2_SP_MG_b_0:    - P_MG_b_0 + SP_MG_b_0 <= 0
 C3_SP_MG_b_0:    - P_MG_b_0 - 5000 S_MG_b_0 + SP_MG_b_0 >= -5000
 C1_SP_MG_s_0:    - 5000 S_MG_s_0 + SP_MG_s_0 <= 0
 C2_SP_MG_s_0:    - P_MG_s_0 + SP_MG_s_0 <= 0
 C3_SP_MG_s_0:    - P_MG_s_0 - 5000 S_MG_s_0 + SP_MG_s_0 >= -5000
 C1_SP_B_dch_0:   - 1000 S_B_dch_0 + SP_B_dch_0 <= 0
 C2_SP_B_dch_0:   - P_B_dch_0 + SP_B_dch_0 <= 0
 C3_SP_B_dch_0:   - P_B_dch_0 - 1000 S_B_dch_0 + SP_B_dch_0 >= -1000
 C1_SP_B_ch_0:    - 1000 S_B_ch_0 + SP_B_ch_0 <= 0
 C2_SP_B_ch_0:    - P_B_ch_0 + SP_B_ch_0 <= 0
 C3_SP_B_ch_0:    - P_B_ch_0 - 1000 S_B_ch_0 + SP_B_ch_0 >= -1000
 C1_SP_MG_b_1:    - 5000 S_MG_b_1 + SP_MG_b_1 <= 0
 C2_SP_MG_b_1:    - P_MG_b_1 + SP_MG_b_1 <= 0
 C3_SP_MG_b_1:    - P_MG_b_1 - 5000 S_MG_b_1 + SP_MG_b_1 >= -5000
 C1_SP_MG_s_1:    - 5000 S_MG_s_1 + SP_MG_s_1 <= 0
 C2_SP_MG_s_1:    - P_MG_s_1 + SP_MG_s_1 <= 0
 C3_SP_MG_s_1:    - P_MG_s_1 - 5000 S_MG_s_1 + SP_MG_s_1 >= -5000
 C1_SP_B_dch_1:   - 1000 S_B_dch_1 + SP_B_dch_1 <= 0
 C2_SP_B_dch_1:   - P_B_dch_1 + SP_B_dch_1 <= 0
 C3_SP_B_dch_1:   - P_B_dch_1 - 1000 S_B_dch_1 + SP_B_dch_1 >= -1000
 C1_SP_B_ch_1:    - 1000 S_B_ch_1 + SP_B_ch_1 <= 0
 C2_SP_B_ch_1:    - P_B_ch_1 + SP_B_ch_1 <= 0
 C3_SP_B_ch_1:    - P_B_ch_1 - 1000 S_B_ch_1 + SP_B_ch_1 >= -1000
 C1_SP_MG_b_2:    - 5000 S_MG_b_2 + SP_MG_b_2 <= 0
 C2_SP_MG_b_2:    - P_MG_b_2 + SP_MG_b_2 <= 0
 C3_SP_MG_b_2:    - P_MG_b_2 - 5000 S_MG_b_2 + SP_MG_b_2 >= -5000
 C1_SP_MG_s_2:    - 5000 S_MG_s_2 + SP_MG_s_2 <= 0
 C2_SP_MG_s_2:    - P_MG_s_2 + SP_MG_s_2 <= 0
 C3_SP_MG_s_2:    - P_MG_s_2 - 5000 S_MG_s_2 + SP_MG_s_2 >= -5000
 C1_SP_B_dch_2:   - 1000 S_B_dch_2 + SP_B_dch_2 <= 0
 C2_SP_B_dch_2:   - P_B_dch_2 + SP_B_dch_2 <= 0
 C3_SP_B_dch_2:   - P_B_dch_2 - 1000 S_B_dch_2 + SP_B_dch_2 >= -1000
 C1_SP_B_ch_2:    - 1000 S_B_ch_2 + SP_B_ch_2 <= 0
 C2_SP_B_ch_2:    - P_B_ch_2 + SP_B_ch_2 <= 0
 C3_SP_B_ch_2:    - P_B_ch_2 - 1000 S_B_ch_2 + SP_B_ch_2 >= -1000
 C1_SP_MG_b_3:    - 5000 S_MG_b_3 + SP_MG_b_3 <= 0
 C2_SP_MG_b_3:    - P_MG_b_3 + SP_MG_b_3 <= 0
 C3_SP_MG_b_3:    - P_MG_b_3 - 5000 S_MG_b_3 + SP_MG_b_3 >= -5000
 C1_SP_MG_s_3:    - 5000 S_MG_s_3 + SP_MG_s_3 <= 0
 C2_SP_MG_s_3:    - P_MG_s_3 + SP_MG_s_3 <= 0
 C3_SP_MG_s_3:    - P_MG_s_3 - 5000 S_MG_s_3 + SP_MG_s_3 >= -5000
 C1_SP_B_dch_3:   - 1000 S_B_dch_3 + SP_B_dch_3 <= 0
 C2_SP_B_dch_3:   - P_B_dch_3 + SP_B_dch_3 <= 0
 C3_SP_B_dch_3:   - P_B_dch_3 - 1000 S_B_dch_3 + SP_B_dch_3 >= -1000
 C1_SP_B_ch_3:    - 1000 S_B_ch_3 + SP_B_ch_3 <= 0
 C2_SP_B_ch_3:    - P_B_ch_3 + SP_B_ch_3 <= 0
 C3_SP_B_ch_3:    - P_B_ch_3 - 1000 S_B_ch_3 + SP_B_ch_3 >= -1000
 C1_SP_MG_b_4:    - 5000 S_MG_b_4 + SP_MG_b_4 <= 0
 C2_SP_MG_b_4:    - P_MG_b_4 + SP_MG_b_4 <= 0
 C3_SP_MG_b_4:    - P_MG_b_4 - 5000 S_MG_b_4 + SP_MG_b_4 >= -5000
 C1_SP_MG_s_4:    - 5000 S_MG_s_4 + SP_MG_s_4 <= 0
 C2_SP_MG_s_4:    - P_MG_s_4 + SP_MG_s_4 <= 0
 C3_SP_MG_s_4:    - P_MG_s_4 - 5000 S_MG_s_4 + SP_MG_s_4 >= -5000
 C1_SP_B_dch_4:   - 1000 S_B_dch_4 + SP_B_dch_4 <= 0
 C2_SP_B_dch_4:   - P_B_dch_4 + SP_B_dch_4 <= 0
 C3_SP_B_dch_4:   - P_B_dch_4 - 1000 S_B_dch_4 + SP_B_dch_4 >= -1000
 C1_SP_B_ch_4:    - 1000 S_B_ch_4 + SP_B_ch_4 <= 0
 C2_SP_B_ch_4:    - P_B_ch_4 + SP_B_ch_4 <= 0
 C3_SP_B_ch_4:    - P_B_ch_4 - 1000 S_B_ch_4 + SP_B_ch_4 >= -1000
 C1_SP_MG_b_5:    - 5000 S_MG_b_5 + SP_MG_b_5 <= 0
 C2_SP_MG_b_5:    - P_MG_b_5 + SP_MG_b_5 <= 0
 C3_SP_MG_b_5:    - P_MG_b_5 - 5000 S_MG_b_5 + SP_MG_b_5 >= -5000
 C1_SP_MG_s_5:    - 5000 S_MG_s_5 + SP_MG_s_5 <= 0
 C2_SP_MG_s_5:    - P_MG_s_5 + SP_MG_s_5 <= 0
 C3_SP_MG_s_5:    - P_MG_s_5 - 5000 S_MG_s_5 + SP_MG_s_5 >= -5000
 C1_SP_B_dch_5:   - 1000 S_B_dch_5 + SP_B_dch_5 <= 0
 C2_SP_B_dch_5:   - P_B_dch_5 + SP_B_dch_5 <= 0
 C3_SP_B_dch_5:   - P_B_dch_5 - 1000 S_B_dch_5 + SP_B_dch_5 >= -1000
 C1_SP_B_ch_5:    - 1000 S_B_ch_5 + SP_B_ch_5 <= 0
 C2_SP_B_ch_5:    - P_B_ch_5 + SP_B_ch_5 <= 0
 C3_SP_B_ch_5:    - P_B_ch_5 - 1000 S_B_ch_5 + SP_B_ch_5 >= -1000
 C1_SP_MG_b_6:    - 5000 S_MG_b_6 + SP_MG_b_6 <= 0
 C2_SP_MG_b_6:    - P_MG_b_6 + SP_MG_b_6 <= 0
 C3_SP_MG_b_6:    - P_MG_b_6 - 5000 S_MG_b_6 + SP_MG_b_6 >= -5000
 C1_SP_MG_s_6:    - 5000 S_MG_s_6 + SP_MG_s_6 <= 0
 C2_SP_MG_s_6:    - P_MG_s_6 + SP_MG_s_6 <= 0
 C3_SP_MG_s_6:    - P_MG_s_6 - 5000 S_MG_s_6 + SP_MG_s_6 >= -5000
 C1_SP_B_dch_6:   - 1000 S_B_dch_6 + SP_B_dch_6 <= 0
 C2_SP_B_dch_6:   - P_B_dch_6 + SP_B_dch_6 <= 0
 C3_SP_B_dch_6:   - P_B_dch_6 - 1000 S_B_dch_6 + SP_B_dch_6 >= -1000
 C1_SP_B_ch_6:    - 1000 S_B_ch_6 + SP_B_ch_6 <= 0
 C2_SP_B_ch_6:    - P_B_ch_6 + SP_B_ch_6 <= 0
 C3_SP_B_ch_6:    - P_B_ch_6 - 1000 S_B_ch_6 + SP_B_ch_6 >= -1000
 C1_SP_MG_b_7:    - 5000 S_MG_b_7 + SP_MG_b_7 <= 0
 C2_SP_MG_b_7:    - P_MG_b_7 + SP_MG_b_7 <= 0
 C3_SP_MG_b_7:    - P_MG_b_7 - 5000 S_MG_b_7 + SP_MG_b_7 >= -5000
 C1_SP_MG_s_7:    - 5000 S_MG_s_7 + SP_MG_s_7 <= 0
 C2_SP_MG_s_7:    - P_MG_s_7 + SP_MG_s_7 <= 0
 C3_SP_MG_s_7:    - P_MG_s_7 - 5000 S_MG_s_7 + SP_MG_s_7 >= -5000
 C1_SP_B_dch_7:   - 1000 S_B_dch_7 + SP_B_dch_7 <= 0
 C2_SP_B_dch_7:   - P_B_dch_7 + SP_B_dch_7 <= 0
 C3_SP_B_dch_7:   - P_B_dch_7 - 1000 S_B_dch_7 + SP_B_dch_7 >= -1000
 C1_SP_B_ch_7:    - 1000 S_B_ch_7 + SP_B_ch_7 <= 0
 C2_SP_B_ch_7:    - P_B_ch_7 + SP_B_ch_7 <= 0
 C3_SP_B_ch_7:    - P_B_ch_7 - 1000 S_B_ch_7 + SP_B_ch_7 >= -1000
 C1_SP_MG_b_8:    - 5000 S_MG_b_8 + SP_MG_b_8 <= 0
 C2_SP_MG_b_8:    - P_MG_b_8 + SP_MG_b_8 <= 0
 C3_SP_MG_b_8:    - P_MG_b_8 - 5000 S_MG_b_8 + SP_MG_b_8 >= -5000
 C1_SP_MG_s_8:    - 5000 S_MG_s_8 + SP_MG_s_8 <= 0
 C2_SP_MG_s_8:    - P_MG_s_8 + SP_MG_s_8 <= 0
 C3_SP_MG_s_8:    - P_MG_s_8 - 5000 S_MG_s_8 + SP_MG_s_8 >= -5000
 C1_SP_B_dch_8:   - 1000 S_B_dch_8 + SP_B_dch_8 <= 0
 C2_SP_B_dch_8:   - P_B_dch_8 + SP_B_dch_8 <= 0
 C3_SP_B_dch_8:   - P_B_dch_8 - 1000 S_B_dch_8 + SP_B_dch_8 >= -1000
 C1_SP_B_ch_8:    - 1000 S_B_ch_8 + SP_B_ch_8 <= 0
 C2_SP_B_ch_8:    - P_B_ch_8 + SP_B_ch_8 <= 0
 C3_SP_B_ch_8:    - P_B_ch_8 - 1000 S_B_ch_8 + SP_B_ch_8 >= -1000
 C1_SP_MG_b_9:    - 5000 S_MG_b_9 + SP_MG_b_9 <= 0
 C2_SP_MG_b_9:    - P_MG_b_9 + SP_MG_b_9 <= 0
 C3_SP_MG_b_9:    - P_MG_b_9 - 5000 S_MG_b_9 + SP_MG_b_9 >= -5000
 C1_SP_MG_s_9:    - 5000 S_MG_s_9 + SP_MG_s_9 <= 0
 C2_SP_MG_s_9:    - P_MG_s_9 + SP_MG_s_9 <= 0
 C3_SP_MG_s_9:    - P_MG_s_9 - 5000 S_MG_s_9 + SP_MG_s_9 >= -5000
 C1_SP_B_dch_9:   - 1000 S_B_dch_9 + SP_B_dch_9 <= 0
 C2_SP_B_dch_9:   - P_B_dch_9 + SP_B_dch_9 <= 0
 C3_SP_B_dch_9:   - P_B_dch_9 - 1000 S_B_dch_9 + SP_B_dch_9 >= -1000
 C1_SP_B_ch_9:    - 1000 S_B_ch_9 + SP_B_ch_9 <= 0
 C2_SP_B_ch_9:    - P_B_ch_9 + SP_B_ch_9 <= 0
 C3_SP_B_ch_9:    - P_B_ch_9 - 1000 S_B_ch_9 + SP_B_ch_9 >= -1000
Bounds
 500 <= P_DG_0 <= 2500
 500 <= P_DG_1 <= 2500
 500 <= P_DG_2 <= 2500
 500 <= P_DG_3 <= 2500
 500 <= P_DG_4 <= 2500
 500 <= P_DG_5 <= 2500
 500 <= P_DG_6 <= 2500
 500 <= P_DG_7 <= 2500
 500 <= P_DG_8 <= 2500
 500 <= P_DG_9 <= 2500
 0 <= P_MG_b_0 <= 5000
 0 <= P_MG_b_1 <= 5000
 0 <= P_MG_b_2 <= 5000
 0 <= P_MG_b_3 <= 5000
 0 <= P_MG_b_4 <= 5000
 0 <= P_MG_b_5 <= 5000
 0 <= P_MG_b_6 <= 5000
 0 <= P_MG_b_7 <= 5000
 0 <= P_MG_b_8 <= 5000
 0 <= P_MG_b_9 <= 5000
 0 <= P_MG_s_0 <= 5000
 0 <= P_MG_s_1 <= 5000
 0 <= P_MG_s_2 <= 5000
 0 <= P_MG_s_3 <= 5000
 0 <= P_MG_s_4 <= 5000
 0 <= P_MG_s_5 <= 5000
 0 <= P_MG_s_6 <= 5000
 0 <= P_MG_s_7 <= 5000
 0 <= P_MG_s_8 <= 5000
 0 <= P_MG_s_9 <= 5000
 0 <= S_MG_b_0 <= 1
 0 <= S_MG_b_1 <= 1
 0 <= S_MG_b_2 <= 1
 0 <= S_MG_b_3 <= 1
 0 <= S_MG_b_4 <= 1
 0 <= S_MG_b_5 <= 1
 0 <= S_MG_b_6 <= 1
 0 <= S_MG_b_7 <= 1
 0 <= S_MG_b_8 <= 1
 0 <= S_MG_b_9 <= 1
 0 <= S_MG_s_0 <= 1
 0 <= S_MG_s_1 <= 1
 0 <= S_MG_s_2 <= 1
 0 <= S_MG_s_3 <= 1
 0 <= S_MG_s_4 <= 1
 0 <= S_MG_s_5 <= 1
 0 <= S_MG_s_6 <= 1
 0 <= S_MG_s_7 <= 1
 0 <= S_MG_s_8 <= 1
 0 <= S_MG_s_9 <= 1
 0 <= SP_MG_b_0 <= 5000
 0 <= SP_MG_b_1 <= 5000
 0 <= SP_MG_b_2 <= 5000
 0 <= SP_MG_b_3 <= 5000
 0 <= SP_MG_b_4 <= 5000
 0 <= SP_MG_b_5 <= 5000
 0 <= SP_MG_b_6 <= 5000
 0 <= SP_MG_b_7 <= 5000
 0 <= SP_MG_b_8 <= 5000
 0 <= SP_MG_b_9 <= 5000
 0 <= SP_MG_s_0 <= 5000
 0 <= SP_MG_s_1 <= 5000
 0 <= SP_MG_s_2 <= 5000
 0 <= SP_MG_s_3 <= 5000
 0 <= SP_MG_s_4 <= 5000
 0 <= SP_MG_s_5 <= 5000
 0 <= SP_MG_s_6 <= 5000
 0 <= SP_MG_s_7 <= 5000
 0 <= SP_MG_s_8 <= 5000
 0 <= SP_MG_s_9 <= 5000
 0 <= P_B_dch_0 <= 1000
 0 <= P_B_dch_1 <= 1000
 0 <= P_B_dch_2 <= 1000
 0 <= P_B_dch_3 <= 1000
 0 <= P_B_dch_4 <= 1000
 0 <= P_B_dch_5 <= 1000
 0 <= P_B_dch_6 <= 1000
 0 <= P_B_dch_7 <= 1000
 0 <= P_B_dch_8 <= 1000
 0 <= P_B_dch_9 <= 1000
 0 <= P_B_ch_0 <= 1000
 0 <= P_B_ch_1 <= 1000
 0 <= P_B_ch_2 <= 1000
 0 <= P_B_ch_3 <= 1000
 0 <= P_B_ch_4 <= 1000
 0 <= P_B_ch_5 <= 1000
 0 <= P_B_ch_6 <= 1000
 0 <= P_B_ch_7 <= 1000
 0 <= P_B_ch_8 <= 1000
 0 <= P_B_ch_9 <= 1000
 0 <= S_B_dch_0 <= 1
 0 <= S_B_dch_1 <= 1
 0 <= S_B_dch_2 <= 1
 0 <= S_B_dch_3 <= 1
 0 <= S_B_dch_4 <= 1
 0 <= S_B_dch_5 <= 1
 0 <= S_B_dch_6 <= 1
 0 <= S_B_dch_7 <= 1
 0 <= S_B_dch_8 <= 1
 0 <= S_B_dch_9 <= 1
 0 <= S_B_ch_0 <= 1
 0 <= S_B_ch_1 <= 1
 0 <= S_B_ch_2 <= 1
 0 <= S_B_ch_3 <= 1
 0 <= S_B_ch_4 <= 1
 0 <= S_B_ch_5 <= 1
 0 <= S_B_ch_6 <= 1
 0 <= S_B_ch_7 <= 1
 0 <= S_B_ch_8 <= 1
 0 <= S_B_ch_9 <= 1
 0 <= SP_B_dch_0 <= 1000
 0 <= SP_B_dch_1 <= 1000
 0 <= SP_B_dch_2 <= 1000
 0 <= SP_B_dch_3 <= 1000
 0 <= SP_B_dch_4 <= 1000
 0 <= SP_B_dch_5 <= 1000
 0 <= SP_B_dch_6 <= 1000
 0 <= SP_B_dch_7 <= 1000
 0 <= SP_B_dch_8 <= 1000
 0 <= SP_B_dch_9 <= 1000
 0 <= SP_B_ch_0 <= 1000
 0 <= SP_B_ch_1 <= 1000
 0 <= SP_B_ch_2 <= 1000
 0 <= SP_B_ch_3 <= 1000
 0 <= SP_B_ch_4 <= 1000
 0 <= SP_B_ch_5 <= 1000
 0 <= SP_B_ch_6 <= 1000
 0 <= SP_B_ch_7 <= 1000
 0 <= SP_B_ch_8 <= 1000
 0 <= SP_B_ch_9 <= 1000
 20 <= SOC_0 <= 100
 20 <= SOC_1 <= 100
 20 <= SOC_2 <= 100
 20 <= SOC_3 <= 100
 20 <= SOC_4 <= 100
 20 <= SOC_5 <= 100
 20 <= SOC_6 <= 100
 20 <= SOC_7 <= 100
 20 <= SOC_8 <= 100
 20 <= SOC_9 <= 100
Binaries
 S_MG_b_0  S_MG_b_1  S_MG_b_2  S_MG_b_3  S_MG_b_4  S_MG_b_5  S_MG_b_6 
 S_MG_b_7  S_MG_b_8  S_MG_b_9  S_MG_s_0  S_MG_s_1  S_MG_s_2  S_MG_s_3 
 S_MG_s_4  S_MG_s_5  S_MG_s_6  S_MG_s_7  S_MG_s_8  S_MG_s_9  S_B_dch_0 
 S_B_dch_1  S_B_dch_2  S_B_dch_3  S_B_dch_4  S_B_dch_5  S_B_dch_6  S_B_dch_7 
 S_B_dch_8  S_B_dch_9  S_B_ch_0  S_B_ch_1  S_B_ch_2  S_B_ch_3  S_B_ch_4 
 S_B_ch_5  S_B_ch_6  S_B_ch_7  S_B_ch_8  S_B_ch_9 
Generals
 P_DG_0  P_DG_1  P_DG_2  P_DG_3  P_DG_4  P_DG_5  P_DG_6  P_DG_7  P_DG_8 
 P_DG_9  P_MG_b_0  P_MG_b_1  P_MG_b_2  P_MG_b_3  P_MG_b_4  P_MG_b_5  P_MG_b_6 
 P_MG_b_7  P_MG_b_8  P_MG_b_9  P_MG_s_0  P_MG_s_1  P_MG_s_2  P_MG_s_3 
 P_MG_s_4  P_MG_s_5  P_MG_s_6  P_MG_s_7  P_MG_s_8  P_MG_s_9  SP_MG_b_0 
 SP_MG_b_1  SP_MG_b_2  SP_MG_b_3  SP_MG_b_4  SP_MG_b_5  SP_MG_b_6  SP_MG_b_7 
 SP_MG_b_8  SP_MG_b_9  SP_MG_s_0  SP_MG_s_1  SP_MG_s_2  SP_MG_s_3  SP_MG_s_4 
 SP_MG_s_5  SP_MG_s_6  SP_MG_s_7  SP_MG_s_8  SP_MG_s_9  P_B_dch_0  P_B_dch_1 
 P_B_dch_2  P_B_dch_3  P_B_dch_4  P_B_dch_5  P_B_dch_6  P_B_dch_7  P_B_dch_8 
 P_B_dch_9  P_B_ch_0  P_B_ch_1  P_B_ch_2  P_B_ch_3  P_B_ch_4  P_B_ch_5 
 P_B_ch_6  P_B_ch_7  P_B_ch_8  P_B_ch_9  SP_B_dch_0  SP_B_dch_1  SP_B_dch_2 
 SP_B_dch_3  SP_B_dch_4  SP_B_dch_5  SP_B_dch_6  SP_B_dch_7  SP_B_dch_8 
 SP_B_dch_9  SP_B_ch_0  SP_B_ch_1  SP_B_ch_2  SP_B_ch_3  SP_B_ch_4  SP_B_ch_5 
 SP_B_ch_6  SP_B_ch_7  SP_B_ch_8  SP_B_ch_9  SOC_0  SOC_1  SOC_2  SOC_3  SOC_4 
 SOC_5  SOC_6  SOC_7  SOC_8  SOC_9 
End
