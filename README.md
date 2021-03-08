MAGIC User Guide
=================

What is MAGIC?
---------------

We surveyed relevant software tools made available by the MicroGrid Design community, e.g.  DER-CAM, Homer, LEAP (Long Range Energy Alternatives Planning), EAM (Economic Evaluation of Microgrids). These available open domain tools help only in Microgrid economic planning, design and simulation. Component models are not editable, control strategies are fixed. Hence, we design and develop a customized software tool called **MAGIC (Modelica based Automated Microgrid Generation & Intelligent Control)**. Salient features of this tool:

![Magic_features](/img/magic_features.png)

## Frontend for high-level initial specification

This software tool provides high-level guidance to users for selecting grid configuration (essentially the bus architecture), load specification, Distributed Energy Resources (DERs) specification etc. Using this high-level input, our tool flow consults a “rule library” that implements standard electrical connection logics (for the component classes provided) and generates an XML based representation of the Microgrid in the form of a Graph. Identifying such a “rule-set” for interconnection of components has been done as part of this work-package and it helps in the creation of MicroGrid models with significant automation. A screenshot of our software tool GUI:

![Magic_tool](/img/magic_tool.png)

## Code generation from high-level model to simulatable code

On user confirmation of the grid architecture, the tool generates an XML representation of the grid-graph which is further used by backend code-generators which connects the functional blocks and synthesizes a flattened out Modelica file (.mo) which may be converted to C code using the OpenModelica compiler omc and simulated.

Getting Started
-------------------

## System / Software Dependencies

* Platform: _32/64 bit Ubuntu Distribution_
* External Tools: _OpenModelica_
* Other Requirements: _Python (Version: 3.5 or higher)_

## Installation Instructions

### OpenModelica: Debian / Ubuntu Packages

Run the following command in the terminal:
```
for deb in deb deb-src; do echo "$deb http://build.openmodelica.org/apt `lsb_release -cs` stable"; done | sudo tee /etc/apt/sources.list.d/openmodelica.list
```

Import the GPG key used to sign the releases:
```
wget -q http://build.openmodelica.org/apt/openmodelica.asc -O- | sudo apt-key add - 
# To verify that your key is installed correctly
apt-key fingerprint
# Gives output:
# pub   2048R/64970947 2010-06-22
#      Key fingerprint = D229 AF1C E5AE D74E 5F59  DF30 3A59 B536 6497 0947
# uid                  OpenModelica Build System 
```

Then update and install OpenModelica
```
sudo apt update
sudo apt install openmodelica
```

#### Installing Modelica libraries

In the current release of OpenModelica, you use apt to install libraries:

>for PKG in `apt-cache search "omlib-.*" | cut -d" " -f1`; do sudo apt-get install -y "$PKG"; done # Installs optional Modelica libraries (most have not been tested with OpenModelica)

**Note:** *You may check the OpenModelica Users Guide for details: https://openmodelica.org/doc/OpenModelicaUsersGuide/latest/index.html*

#### Installing Custom Modelica Microgrid library

Download the file `MicroGrid.zip` from the following repo: https://github.com/SmartGridApp/Modelica-Files

Unzip the file in any directory. Open the OpenModelica software GUI by running the command in terminal:
>OMEdit

Open the `File Menu` from top-left of the tool -> Click `Load Library` 

When a file browsing pop-up opens, go into the unzipped `Microgrid` folder -> Search for `Package.mo` file and open it.

### Python

#### Prerequisites
```
sudo apt-get install build-essential checkinstall
sudo apt-get install libreadline-gplv2-dev libncursesw5-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev
```

#### Download Python 3.5
```
cd /usr/src
wget https://www.python.org/ftp/python/3.5.9/Python-3.5.9.tgz
sudo tar xzf Python-3.5.9.tgz
```

#### Install Python
```
cd Python-3.5.9
sudo ./configure --enable-optimizations
sudo make altinstall
```

#### Check the Python Version
```
python3.5 -V

#Python 3.5.9
```

Using the Software Tool `MAGIC`
-------------------------------------

## Setting up local HTTP Servers with Python

#### Tool Server Setup
Run the following Commands:
```
git clone https://github.com/arnab-m/imprint-mgp.git .
cd imprint-mgp/MAGIC
python3 -m http.server 8000
```

#### Control Server Setup
Run the following Commands:
```
cd imprint-mgp/MAGIC/Scheduler
python3 controlModel.py
```

## Running MAGIC

* In any browser hit this url: `http://localhost:8000` -> The Tool opens
* You can see all the components listed in the left side bar

![Magic_demo_1](/img/magic_demo_1.png)

* In the header panel, six buttons are there:
	* `ReArrange` => It is used to move and rearrange the components
	* `Connection` => It connects the components following each click
	* `Undo` => Any step is undone by clicking it
	* `Clear Grid` => By clicking this button, we reset the grid by removing all components along with its connections
	* `Show MO/Design` => Toggle between Modelica code for the model and the UI design of the model
	* `Options`:
		* _Save_ => It saves the current model design for future use
		* _Load_ => It loads any saved model design
		* _Download XML_ => Generalized XML can be downloaded
		* _Download MO_ => Downloads Final Modelica code for the model design

![Magic_demo_2](/img/magic_demo_2.png)

#### Load an Existing Model

* Load a pre-saved model by clicking the above-mentioned `Load` button.
>The model loads and you can see the design on the Grid. By clicking the “Show MO” button, you can see the code for it. You may move/delete/add any component and connection as you wish. Accordingly, the code will change. After you are done with your modification, download the modelica code by clicking the `Download MO` button.

![Magic_demo_3](/img/magic_demo_3.png)

#### Build a Model from Scratch

* Reset the Grid by clicking the `Clear Grid` button.
* Click on a component => It is selected.
* Move the cursor and click on any point of the Grid => The component will be placed there.
* Click the properties button on it => Properties modal box opens.
	* You may change the component name as per your convenience.
	* Click the `+` button to add the component attributes.
	* Choose the attribute from the dropdown => Corresponding default value will be assigned. If you wish, you may change the value.
	* After defining all the attributes of the component, click the `save` button.
* Again if you wish to change the properties of the component:
	* Open the properties modal box.
	* Delete any attribute row by clicking the `binBox` button in the left and again add it following the above mentioned procedures.

![Magic_demo_4](/img/magic_demo_4.png)

![Magic_demo_5](/img/magic_demo_5.png)

* Corresponding codes are updated following your changes. You can check it by clicking the `Show MO` button.
* You can go back to the design mode by clicking the `Show Design` button.

![Magic_demo_6](/img/magic_demo_6.png)

* You may delete the component by clicking the `cross` button on the component.
* On adding all your required components, if you want to change the location of any component:
	* Click the `ReArrange` button => Checkbox appears on each component.
	* Click the checkbox of the component you want to move => Then click on any preferred location of your choice in the Grid => The component will be re-arranged.
* Finally connecting the components:
	* Click on the `Connection` button => Checkbox appears on each component.
	* Choose the source component checkbox and next, click the destination component checkbox => Arrow lines appear following your choice of source and destination.
	* Corresponding connection modelica codes change accordingly.

![Magic_demo_7](/img/magic_demo_7.png)

![Magic_demo_8](/img/magic_demo_8.png)

* Once you finalize the design, download the modelica file for the model by clicking the `Download MO` button.
<!-- * Look for the path `MicroGrid/Examples/OnePhase` in the custom MicroGrid modelica library and keep this downloaded modelica file inside it.-->

![Magic_demo_9](/img/magic_demo_9.png)

* Press the `Control` button => A new webpage will open and the controller starts working on the generated model.

![Magic_demo_10](/img/magic_demo_10.png)

* Simulation runs at the backend and currently once it is done, the corresponding simulation results can be seen on the control server command terminal and in the `Scheduler` folder.

Contributors
-------------------
Please email us bug reports!! The project is under constant improvement!

* Arnab Mondal [amondal23@iitkgp.ac.in]
* Rumia Masburah [rumiamasburah@iitkgp.ac.in]
* Jai Mathur [jai.mathur11@gmail.com]
* Soumyajit Dey [soumya@cse.iitkgp.ac.in]
<!-- * Arnab Sarkar [arnabsarkar@iitg.ac.in]
* Arijit Mondal [arijit@iitp.ac.in] -->

Funding and Acknowledgements
-----------------------------------
This project is sponsored under the IMPRINT-I Scheme by MHRD and Ministry of Power, GoI, undertaken in the Department of Computer Science And Engineering, IIT Kharagpur, India.



