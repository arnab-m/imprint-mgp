MAGIC User Guide
=================

What is MAGIC?
---------------

We surveyed relevant software tools made available by the MicroGrid Design community, e.g.  DER-CAM, Homer, LEAP (Long Range Energy Alternatives Planning), EAM (Economic Evaluation of Microgrids). These available open domain tools help only in Microgrid economic planning, design and simulation. Component models are not editable, control strategies are fixed. Hence, we design and develop a customized software tool called MAGIC (Modelica based Automated Microgrid Generation & Intelligent Control). Salient features of this tool:

![Magic_features](/img/magic_features.png)

### Frontend for high-level initial specification

This software tool provides high-level guidance to users for selecting grid configuration (essentially the bus architecture), load specification, Distributed Energy Resources (DERs) specification etc. Using this high-level input, our tool flow consults a “rule library” that implements standard electrical connection logics (for the component classes provided) and generates an XML based representation of the Microgrid in the form of a Graph. Identifying such a “rule-set” for interconnection of components has been done as part of this work-package and it helps in the creation of MicroGrid models with significant automation. A screenshot of our software tool GUI:

![Magic_tool](/img/magic_tool.png)

### Code generation from high-level model to simulatable code

On user confirmation of the grid architecture, the tool generates an XML representation of the grid-graph which is further used by backend code-generators which connects the functional blocks and synthesizes a flattened out Modelica file (.mo) which may be converted to C code using the OpenModelica compiler omc and simulated.

Getting Started
-------------------

### System / Software Dependencies

* Platform: _32/64 bit Ubuntu Distribution_
* External Tools: _OpenModelica_
* Other Requirements: _Python (Version: 3.5 or higher)_

### Installation Instructions

#### OpenModelica: Debian / Ubuntu Packages

###### Installing Modelica libraries

Contributors
-------------------
Please email us bug reports!! The project is under constant improvement!

* Arnab Mondal [amondal23@iitkgp.ac.in]
* Rumia Masburah [rumiamasburah@iitkgp.ac.in]
* Jai Mathur [jai.mathur11@gmail.com]
* Soumyajit Dey [soumya@cse.iitkgp.ac.in]
* Arnab Sarkar [arnabsarkar@iitg.ac.in]
* Arijit Mondal [arijit@iitp.ac.in]

Funding and Acknowledgements
-----------------------------------
This project is sponsored under the IMPRINT-I Scheme by MHRD and Ministry of Power, GoI, undertaken in the Department of Computer Science And Engineering, IIT Kharagpur, India.



