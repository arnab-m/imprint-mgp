'use strict';

var designerControllers = angular.module('designerControllers', []);

designerControllers
		.controller(
				'designerControllers',
				['$scope','$q', 'ComponentTypes','designerService','$http',function($scope, $q, ComponentTypes,designerService,$http) {
				
					/**************************************************************/
					//App init
					/**************************************************************/
					$scope.init=function()
					{
						// load components object
						$scope.componentList=ComponentTypes.componentList;
						$scope.linkList=ComponentTypes.linkList;
						$scope.showGrid=true;
							
						//Application context						 
						$scope.appContext={
								undo :[],
								designSchema :{component : [], connection : []}
								};
						
						$scope.circuitConnection=[];
						$scope.connector=[]; //temp array to hold the connection coordinates
						$scope.componentIndex=1;
						$scope.connectionIndex=1;
						$scope.selectedComponentId;
						$scope.ComponentUniqueId;
						$scope.SourceTerminal;
						$scope.DestTerminal;
						
						// set grid dimentsion
						$scope.ROWS=25;
						$scope.COLUMNS=30;	
						
						$scope.loadComponent();
						$scope.selectedComponentName="No Component Selected";
						$scope.connections=
						{
							sourceRow : null,
							sourceColumn : null, 
							destinationRow : null,
							destinationColumn : null
						}
						$scope.mode = "Design";
						$scope.blinkFrequency=100;
						$scope.blinkTimeOut=600;

						$scope.rightDir="RIGHT";
						$scope.leftDir="LEFT";
						$scope.downDir="DOWN";
						$scope.upDir="UP";
						$scope.tiggleDesignButton="MO";
						$scope.sureToClear=false;
						$scope.drawLine=false;
						$scope.lineCol=[];
						$scope.lineTag="AC";
						$scope.newXMLBody = "";
					}
					
					/**************************************************************/
					//load empty component grid
					/**************************************************************/
					$scope.loadComponent=function()
					{
						$scope.gridMatrix=new Array($scope.ROWS);
						for (let i=0; i <$scope.ROWS; i++)
						{
							$scope.gridMatrix[i]=new Array($scope.COLUMNS);
						}
					}
					
					/**************************************************************/
					//display and hide the vertical line coulmn
					/**************************************************************/
					$scope.draw=function()
					{
						$scope.drawLine=!$scope.drawLine;
					}
					
					
					/**************************************************************/
					//create vertical line
					/**************************************************************/
					$scope.setLine=function(column)
					{
						$scope.lineCol.push(column);
						for(let i=1;i<$scope.gridMatrix.length;i++)
						{
							$scope.gridMatrix[i][column]={};
							$scope.gridMatrix[i][column].lineCol=true;
							$scope.gridMatrix[i][column].isLine=true;
						}
						$scope.drawLine=!$scope.drawLine;
					}
					
					$scope.toggleTag=function()
					{
						if($scope.lineTag=="AC")
						{
							$scope.lineTag="DC";
						}
						else
						{
							$scope.lineTag="AC";
						}
					}
					
					/**************************************************************/
					//load Rows
					/**************************************************************/
					$scope.loadRows=function(count)
					{
						for (let i=0; i <count; i++)
						{
							$scope.gridMatrix[$scope.ROWS+i]=new Array($scope.COLUMNS);
						}
					}
					
					/**************************************************************/
					//load Columns
					/**************************************************************/
					$scope.loadCol=function(count)
					{
						for (let i=0; i <$scope.ROWS; i++)
						{
							for (let j=0; j <count; j++)
							{
							$scope.gridMatrix[i].push(null);
							}
						}
					}
					
					$scope.init();
					
					/**************************************************************/
					//Component Select 
					/**************************************************************/
					$scope.selectComponent=function(component){
						$scope.mode="Design";
						$scope.selectedComponent=component;
						$scope.selectedComponentName=component.name;
						$scope.selectedComponentId=component.id-1;
						$scope.ComponentUniqueId=component.id;
						$("#alertBox").removeClass("panel-red");
						$("#alertBox").addClass("panel-green");
						$("#wrapper").addClass("grabbing");
					}

					
					/**************************************************************/
					//cell Select 
					/**************************************************************/
					$scope.cellSelected=function(row,col)
					{
						//check coulumn and row selected 
						if(row>$scope.ROWS-5)
						{
							$scope.loadRows(20);
							$scope.ROWS+=20;

						} 
						if(col>$scope.COLUMNS-5)
						{
							$scope.loadCol(20);
							$scope.COLUMNS+=20;
						}
						
						$("#wrapper").removeClass("grabbing");
						
						switch($scope.mode)
						{
						case "Design" : $scope.getDesignMode(row,col);break;
						case "connection" : $scope.getConnectionMode(row,col);break;
						case "rearrange" :$scope.getRearrangeMode(row,col); break;
						case "openCellRearrange" : $scope.getOpenCellRearrangeMode(row,col);break;
						}
					}

					/**************************************************************/
					//Call Design Logic 
					/**************************************************************/
					$scope.getDesignMode=function(row,col)
					{
						if($scope.selectedComponent!=null && $scope.checkOverrideCondition(row,col))
						{
							var componentCoordinate={row : row, col : col};
							$scope.appContext.undo.push({type : "COMPONENT",coordinate : componentCoordinate});
							
							var component=
							{
									coordinate : componentCoordinate,
									name : $scope.selectedComponent.type,
									id : $scope.componentIndex,
									type : $scope.selectedComponent.type,
									properties : [],
									//link	: null,
									link	: $scope.selectedComponent.terminal,
									namespace : $scope.getNameSpace($scope.selectedComponent.type),
									componentRefID : $scope.selectedComponentId,
									componentOriId : $scope.ComponentUniqueId
							}
							console.log(component);
							
							
							$scope.componentIndex++;
							$scope.appContext.designSchema.component.push(component);
							
							$scope.gridMatrix[row][col]=component;
							$scope.selectedComponent=null;
							$scope.selectedComponentName="Selected Another Component";
							$("#alertBox").removeClass("panel-green");
							$("#alertBox").addClass("panel-red");
						}
						else
						{
							if($scope.selectedComponent==null)
							{
								$scope.selectedComponentName="Selected Another Component";
							}
							$scope.selectedComponent=null;
							$scope.blink();
						}
					}
					
					/**************************************************************/
					//get NameSpace 
					/**************************************************************/
					$scope.getNameSpace=function(type)
					{
						for(let i=0;i<$scope.componentList.length;i++)
						{
							if($scope.componentList[i].type==type)
							{
								return $scope.componentList[i].namespace;
								break;
							}
						}
					}
					
					
					/**************************************************************/
					//Verify cell occupancy constraint 
					/**************************************************************/
					$scope.checkOverrideCondition=function(row,col)
					{
						var oldmsg=$scope.selectedComponentName;
						$scope.selectedComponentName="Do not put component over,adjacent and diagonally to connection/component! ";
						
						if(!$scope.isConnectionCell(row,col) && !$scope.isComponentCell(row,col) && $scope.checkDiagonal(row,col) && $scope.adjacentCheck(row,col))
						{
							$scope.selectedComponentName=oldmsg;
							return true;
						}
						return false;
					}
					
					/**************************************************************/
					//Verify adjacent cell constraint 
					/**************************************************************/
					$scope.adjacentCheck=function(row,col)
					{
						if(row+1<$scope.ROWS)
						{
							if($scope.isConnectionCell(row+1,col) || $scope.isComponentCell(row+1,col))
							{
								return false;
							}
						}
						if(row-1>=0)
						{
							if($scope.isConnectionCell(row-1,col) || $scope.isComponentCell(row-1,col))
							{
								return false;
							}
						}
						if(col+1<$scope.COLUMNS)
						{
							if($scope.isConnectionCell(row,col+1) || $scope.isComponentCell(row,col+1))
							{
								return false;
							}
						}
						if(col-1>=0)
						{
							if($scope.isConnectionCell(row,col-1) || $scope.isComponentCell(row,col-1))
							{
								return false;
							}
						}
						return true
					}
					
					/**************************************************************/
					//Verify diagonally cell constraint 
					/**************************************************************/
					$scope.checkDiagonal=function(row,col)
					{
						if(row+1<$scope.ROWS && col+1<$scope.COLUMNS)
						{
							if($scope.isConnectionCell(row+1,col+1) || $scope.isComponentCell(row+1,col+1))
							{
								return false;
							}
						}
						if(row-1>=0 && col-1>=0)
						{
							if($scope.isConnectionCell(row-1,col-1) || $scope.isComponentCell(row-1,col-1))
							{
								return false;
							}
						}
						if(row+1<$scope.ROWS && col-1>=0)
						{
							if($scope.isConnectionCell(row+1,col-1) || $scope.isComponentCell(row+1,col-1))
							{
								return false;
							}
						}
						if(row-1>=0 && col+1<$scope.COLUMNS)
						{
							if($scope.isConnectionCell(row-1,col+1) || $scope.isComponentCell(row-1,col+1))
							{
								return false;
							}
						}
						return true;
					}

					/**************************************************************/
					//verify the cellis connectedcell 
					/**************************************************************/
					$scope.isConnectionCell=function(sRow,sCol)
					{
						if(typeof $scope.gridMatrix[sRow][sCol]!="undefined" && $scope.gridMatrix[sRow][sCol]!=null && $scope.gridMatrix[sRow][sCol].direction!=null)
						{
							return true;
						}
						else
						{
							return false;
						}
					}
					
					/**************************************************************/
					//ReArrange components
					/**************************************************************/
					$scope.reArrange=function()
					{
						$scope.mode="rearrange";
					}
					
					/**************************************************************/
					//Call Rearrange prior Logic 
					/**************************************************************/
					$scope.getRearrangeMode=function(row,col)
					{
						if(typeof $scope.gridMatrix[row][col]=="undefined")
						{
							$scope.mode = "Design"
						}
						else
						{
						$("#wrapper").addClass("grabbing");
						$scope.connections.sourceRow = row;
						$scope.connections.sourceColumn = col;
						$scope.selectedComponentName="Click at another Location to relocate component";
						$scope.blink();
						$scope.mode ="openCellRearrange"
						}
					}
					
					/**************************************************************/
					//Call Rearrange after Logic 
					/**************************************************************/
					$scope.getOpenCellRearrangeMode=function(row,col)
					{
						if($scope.checkOverrideCondition(row,col))
						{
							$scope.gridMatrix[row][col]=angular.copy($scope.gridMatrix[$scope.connections.sourceRow][$scope.connections.sourceColumn]);
							$scope.gridMatrix[row][col].coordinate={row : row,col : col}
							
							if($scope.gridMatrix[$scope.connections.sourceRow][$scope.connections.sourceColumn].connections!=undefined
								&& $scope.gridMatrix[$scope.connections.sourceRow][$scope.connections.sourceColumn].connections.length>0) 
								$scope.removeConnection($scope.connections.sourceRow,$scope.connections.sourceColumn);
								
							$scope.removeComponent($scope.connections.sourceRow,$scope.connections.sourceColumn);
							$scope.gridMatrix[row][col].connections=[];
						
							$scope.appContext.designSchema.component[$scope.gridMatrix[row][col].id-1]=$scope.gridMatrix[row][col];
							$scope.appContext.undo.pop();
							$scope.appContext.undo.push({type : "COMPONENT",coordinate : {row : row,col : col}});
							$scope.reset();
							var temp=[];
							
							if($scope.gridMatrix[row][col].componentConnectedpairs!=undefined)
							{
								temp=angular.copy($scope.gridMatrix[row][col].componentConnectedpairs);
								$scope.gridMatrix[row][col].componentConnectedpairs=[];

								for(let i=0;i<temp.length;i++)
								{
									if(temp[i].flow=='outward')
									{
										$scope.findconnectedCell(row,col,temp[i].coordinate.row,temp[i].coordinate.col);
									}
									else if(temp[i].flow=='inward')
									{
										$scope.findconnectedCell(temp[i].coordinate.row,temp[i].coordinate.col,row,col);
									}
								}
							}
							console.log("++++++++++++++++++++++destination : ("+row,col+") ++++++++++++++++++++++++++++++++");
							console.log("component Pair"); console.log($scope.gridMatrix[row][col].componentConnectedpairs);
							console.log("connection "); console.log($scope.gridMatrix[row][col].connections);
						}
						else
						{
							$scope.blink();
						}
					}

					/**************************************************************/
					//Connect components
					/**************************************************************/
					$scope.connectComponent=function()
					{
					//Set mode to Connection
						$scope.mode="connection";
					}
					
					/**************************************************************/
					//Call Connection logic
					/**************************************************************/
					$scope.getConnectionMode=function(row,col){
						if(typeof $scope.gridMatrix[row][col]=="undefined" || $scope.gridMatrix[row][col]==null)
						{
							$scope.reset();
						}
						else
						{
							if($scope.connections.sourceRow==null && $scope.connections.sourceColumn==null)
							{
								$scope.connections.sourceRow=row;
								$scope.connections.sourceColumn=col;
							}
							else
							{
								$scope.connections.destinationRow=row;
								$scope.connections.destinationColumn=col;
								
								//calculate the set of cell need to mark dotted
								if(!($scope.connections.sourceRow==$scope.connections.destinationRow && $scope.connections.sourceColumn==$scope.connections.destinationColumn))
									$scope.findconnectedCell($scope.connections.sourceRow,$scope.connections.sourceColumn,$scope.connections.destinationRow,$scope.connections.destinationColumn);
								/*
								 * Reset mode to design 
								 * */
								$scope.reset();
							}
						}
					}
					
					/**************************************************************/
					//Calculate cell to connect two components 
					/**************************************************************/
					$scope.findconnectedCell=function(sRow,sCol,dRow,dCol)
					{
						switch ($scope.getRelativeDirection(sRow,sCol,dRow,dCol)) 
						{
					    case "LEFTUP":    		$scope.LeftUp(sRow,sCol,dRow,dCol);  break;
					    case "LEFTDOWN":   		$scope.LeftDown(sRow,sCol,dRow,dCol);  break;
					    case "RIGHTUP":    		$scope.RightUp(sRow,sCol,dRow,dCol);  break;
					    case "RIGHTDOWN":   	$scope.RightDown(sRow,sCol,dRow,dCol);  break;
					    case "UP":   			$scope.Up(sRow,sCol,dRow,dCol);  break;
					    case "DOWN":   		 	$scope.Down(sRow,sCol,dRow,dCol);  break;
					    case "LEFT":   	 		$scope.Left(sRow,sCol,dRow,dCol);  break;
					    case "RIGHT":    		$scope.Right(sRow,sCol,dRow,dCol);  break;
						}
						
						//$scope.lastArrowDir(dRow,dCol);
						console.log($scope.connector);
						
						if($scope.gridMatrix[sRow][sCol].connections==undefined) 
						{
							$scope.gridMatrix[sRow][sCol].connections=[];
						}
						if( $scope.gridMatrix[sRow][sCol].componentConnectedpairs==undefined)
						{
							$scope.gridMatrix[sRow][sCol].componentConnectedpairs=[];
						}
						
						if($scope.gridMatrix[dRow][dCol].connections==undefined )
						{
							$scope.gridMatrix[dRow][dCol].connections=[];
						}
						if($scope.gridMatrix[dRow][dCol].componentConnectedpairs==undefined)
						{
							$scope.gridMatrix[dRow][dCol].componentConnectedpairs=[];
						}
						
						$scope.gridMatrix[dRow][dCol].componentConnectedpairs.push(
								{
									id 		: $scope.connectionIndex,
									targetComponentId : $scope.gridMatrix[sRow][sCol].id ,
									coordinate : {row : sRow,col : sCol}, 
									flow : 'inward'
								});
						$scope.gridMatrix[sRow][sCol].componentConnectedpairs.push(
								{
									id 		: $scope.connectionIndex,
									targetComponentId : $scope.gridMatrix[dRow][dCol].id ,
									coordinate : {row : dRow,col : dCol}, 
									flow : 'outward'
								});
						
						$scope.gridMatrix[sRow][sCol].connections.push(
									{
										id 		: $scope.connectionIndex,
										targetId 	: $scope.gridMatrix[dRow][dCol].id,
										ConnectionCells : $scope.connector
									});
						$scope.gridMatrix[dRow][dCol].connections.push(
									{
										id 		: $scope.connectionIndex,
										targetId 	: $scope.gridMatrix[sRow][sCol].id,
										ConnectionCells : $scope.connector
									});

						$scope.setRelativeDirections($scope.connector);
						
						$scope.appContext.undo.push({type : "CONNECTOR",coordinate : $scope.connector});
						$scope.addConnectionToContext(sRow,sCol,dRow,dCol,$scope.connector);
						$scope.connector=[];
					}
					
					/**************************************************************/
					//Add connection to context 
					/**************************************************************/
					$scope.addConnectionToContext=function(sourceRow,sourceColumn,destinationRow,destinationColumn,connectionList)
					{
						$scope.appContext.designSchema.connection.push({
							id 		: $scope.connectionIndex,
							srcid 	: $scope.gridMatrix[sourceRow][sourceColumn].componentRefID+1,
							destid 	: $scope.gridMatrix[destinationRow][destinationColumn].componentRefID+1,
							ConnectionCells : connectionList
						});
						console.log("---srcid---");
						console.log($scope.gridMatrix[sourceRow][sourceColumn].componentOriId);
						//console.log($scope.gridMatrix[sourceRow][sourceColumn].namespace);
						console.log("---destid---");
						console.log($scope.gridMatrix[destinationRow][destinationColumn].componentOriId);
						$scope.connectionIndex++;

						if((($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==1)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==5))
							|| (($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==5)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==1)))
							{
								//console.log("---inside1---");
								if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==5)
								{
									$scope.SourceTerminal = 'y';
									$scope.DestTerminal = 'Irradiance_input';
								}
								else
								{
									$scope.SourceTerminal = 'Irradiance_input';
									$scope.DestTerminal = 'y';
								}

								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								});
							}
						else if((($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==2)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==6))
							|| (($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==6)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==2)))
							{
								//console.log("---inside2---");
								if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==6)
								{
									$scope.SourceTerminal = 'y';
									$scope.DestTerminal = 'WindVelocity';
								}
								else
								{
									$scope.SourceTerminal = 'WindVelocity';
									$scope.DestTerminal = 'y';
								}

								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								}); 
							}
						else if((($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==3)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==7))
							|| (($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==7)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==3)))
							{
								//console.log("---inside2---");
								if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==7)
								{
									$scope.SourceTerminal = 'y';
									$scope.DestTerminal = 'P_in';
								}
								else
								{
									$scope.SourceTerminal = 'P_in';
									$scope.DestTerminal = 'y';
								}

								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								}); 
							}
						else if((($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==14)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==15))
							|| (($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==15)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==14)))
							{
								//console.log("---inside2---");
								if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==15)
								{
									$scope.SourceTerminal = 'y';
									$scope.DestTerminal = 'Y';
								}
								else
								{
									$scope.SourceTerminal = 'Y';
									$scope.DestTerminal = 'y';
								}

								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								}); 
							}
						else if((($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==1)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==9))
							|| (($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==9)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==1)))
							{
								//console.log("---inside2---");
								if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==1)
								{
									$scope.SourceTerminal = 'pin_out';
									$scope.DestTerminal = 'terminal_in';
								}
								else
								{
									$scope.SourceTerminal = 'terminal_in';
									$scope.DestTerminal = 'pin_out';
								}

								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								});

								if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==1)
								{
									$scope.SourceTerminal = 'V_out';
									$scope.DestTerminal = 'V_in';
								}
								else
								{
									$scope.SourceTerminal = 'V_in';
									$scope.DestTerminal = 'V_out';
								}

								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								}); 
							}
						else if((($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==3)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==9))
							|| (($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==9)
							&& ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==3)))
							{
								//console.log("---inside2---");
								if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==3)
								{
									$scope.SourceTerminal = 'v_out';
									$scope.DestTerminal = 'V_in';
								}
								else
								{
									$scope.SourceTerminal = 'V_in';
									$scope.DestTerminal = 'v_out';
								}

								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								});

								if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==3)
								{
									$scope.SourceTerminal = 'terminal';
									$scope.DestTerminal = 'terminal_in';
								}
								else
								{
									$scope.SourceTerminal = 'terminal_in';
									$scope.DestTerminal = 'terminal';
								}

								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								}); 
							}
						else if(($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==8)
							|| ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==8))
							{
								//console.log("---inside2---");
								// if(($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==14)
								// || ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==14))
								// {
								if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==14)
								{
									$scope.SourceTerminal = 'V_in';
									$scope.DestTerminal = 'V_out';
								}
								else if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==8
									&& $scope.gridMatrix[destinationRow][destinationColumn].componentOriId==8)
								{
									$scope.SourceTerminal = 'V_out';
									$scope.DestTerminal = 'V_in';
								}
								else if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==8
								&& $scope.gridMatrix[destinationRow][destinationColumn].componentOriId==14)
								{
									$scope.SourceTerminal = 'V_out';
									$scope.DestTerminal = 'V_in';
								}
								else
								{
									$scope.SourceTerminal = 'V_out';
									$scope.DestTerminal = 'V_in';
								}
								//}
								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								});

								if(($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==14)
								|| ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==14))
								{
									if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==14)
									{
										$scope.SourceTerminal = 'terminal';
										$scope.DestTerminal = 'pin_P';
									}
									else
									{
										$scope.SourceTerminal = 'pin_P';
										$scope.DestTerminal = 'terminal';
									}
								}
								else if(($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==10)
								|| ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==10))
								{
									if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==10)
									{
										$scope.SourceTerminal = 'N';
										$scope.DestTerminal = 'pin_N';
									}
									else
									{
										$scope.SourceTerminal = 'pin_P';
										$scope.DestTerminal = 'P';
									}
								}
								else if(($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==9)
								|| ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==9))
								{
									if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==9)
									{
										$scope.SourceTerminal = 'terminal_out';
										$scope.DestTerminal = 'pin_N';
									}
									else
									{
										$scope.SourceTerminal = 'pin_N';
										$scope.DestTerminal = 'terminal_out';
									}
								}
								else if(($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==2)
								|| ($scope.gridMatrix[destinationRow][destinationColumn].componentOriId==2))
								{
									if($scope.gridMatrix[sourceRow][sourceColumn].componentOriId==2)
									{
										$scope.SourceTerminal = 'pin_P1';
										$scope.DestTerminal = 'pin_N';
									}
									else
									{
										$scope.SourceTerminal = 'pin_N';
										$scope.DestTerminal = 'pin_P1';
									}
								}

								$scope.circuitConnection.push(
								{
									srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
									srcLink : 	$scope.SourceTerminal,
									destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
									destLink : 	$scope.DestTerminal,
									srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
									destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
								});
								
							}
							// console.log("---SourceTerminal---");
							// console.log($scope.SourceTerminal);
							// console.log("---DestTerminal---");
							// console.log($scope.DestTerminal);

						// $scope.circuitConnection.push(
						// 	{
						// 		srcName : 	$scope.gridMatrix[sourceRow][sourceColumn].name,
						// 		srcLink : 	$scope.SourceTerminal,
						// 		destName : 	$scope.gridMatrix[destinationRow][destinationColumn].name,
						// 		destLink : 	$scope.DestTerminal,
						// 		srcid	: 	$scope.gridMatrix[sourceRow][sourceColumn].componentOriId,
						// 		destid : 	$scope.gridMatrix[destinationRow][destinationColumn].componentOriId
						// 	});
					}
					
					/**************************************************************/
					// Same Row connection logic 
					/**************************************************************/
					$scope.Left=function(sRow,sCol,dRow,dCol)
					{
						var obsticleCol;
						if((obsticleCol=$scope.moveRight(sRow,sCol,dRow,dCol-1))!=9999)
						{
							$scope.remove(sRow,obsticleCol,"RIGHT");
							if(sRow+1<$scope.ROWS)
							{
								
								$scope.markConnectionCell(sRow,obsticleCol,$scope.downDir);
								$scope.LeftDown(++sRow,obsticleCol,dRow,dCol);
							}
							else
							{
								$scope.markConnectionCell(sRow,obsticleCol,$scope.upDir);
								$scope.LeftUp(--sRow,obsticleCol,dRow,dCol);
							}
							
						}
					}
					
					
					/**************************************************************/
					// Same Row connection logic 
					/**************************************************************/
					$scope.Right=function(sRow,sCol,dRow,dCol)
					{
						var obsticleCol;
						if((obsticleCol=$scope.moveLeft(sRow,sCol,dRow,dCol+1))!=9999)
						{
							$scope.remove(sRow,obsticleCol,"LEFT");
							if(sRow+1<$scope.ROWS)
							{
								$scope.markConnectionCell(sRow,obsticleCol,$scope.downDir);
								//$scope.markConnectionCell(++sRow,obsticleCol,$scope.leftDir);
								$scope.RightDown(++sRow,obsticleCol,dRow,dCol);
							}
							else
							{
								$scope.markConnectionCell(sRow,obsticleCol,$scope.upDir);
								$scope.RightUp(--sRow,obsticleCol,dRow,dCol);
							}
						}
					}
					
					
					/**************************************************************/
					// Same Row connection logic 
					/**************************************************************/
					$scope.Up=function(sRow,sCol,dRow,dCol)
					{
						var obsticleRow;
						if((obsticleRow=$scope.moveDown(sRow,sCol,dRow-1,dCol))!=9999)
						{
							$scope.remove(obsticleRow,sCol,"DOWN");
							if(sCol+1<$scope.COLUMNS)
							{
								$scope.markConnectionCell(obsticleRow,sCol,$scope.rightDir);
								//$scope.markConnectionCell(obsticleRow,sCol+1,$scope.downDir);
								$scope.RightUp(obsticleRow,sCol+1,dRow,dCol);
							}
							else
							{
								$scope.markConnectionCell(obsticleRow,sCol,$scope.leftDir);
								//$scope.markConnectionCell(obsticleRow,sCol-1,$scope.downDir);
								$scope.LeftUp(obsticleRow,sCol-1,dRow,dCol);
							}
						}
					}
					
					
					/**************************************************************/
					// Same Row connection logic 
					/**************************************************************/
					$scope.Down=function(sRow,sCol,dRow,dCol)
					{
						
						var obsticleRow;
						if((obsticleRow=$scope.moveUp(sRow,sCol,dRow+1,dCol))!=9999)
						{
							$scope.remove(obsticleRow,sCol,"UP");
							if(sCol+1<$scope.COLUMNS)
							{
								$scope.markConnectionCell(obsticleRow,sCol,$scope.rightDir);
								$scope.RightDown(obsticleRow,sCol+1,dRow,dCol);
							}
							else
							{
								$scope.markConnectionCell(obsticleRow,sCol,$scope.leftDir);
								$scope.LeftDown(obsticleRow,sCol-1,dRow,dCol);
							}
						}
					}

					/**************************************************************/
					//Component at Left Up position - 2nd quadant
					/**************************************************************/
					$scope.LeftUp=function(sRow,sCol,dRow,dCol)
					{
						var DownRightDirection=false;
						var RightDownDirection=false;
						
						//check the DownRight path
						var destRow=$scope.checkDownDirection(sRow,sCol,dRow,dCol);
						if(destRow!=-1)
						{
							var col=$scope.checkRightDirection(destRow,sCol,dRow,dCol-1);
							if(col!=-1)
							{
								DownRightDirection=true;
							}
						}
						
						//check the RightDown path
						var destCol=$scope.checkRightDirection(sRow,sCol,dRow,dCol);
						if(destCol!=-1)
						{
							var row=$scope.checkDownDirection(sRow,destCol,dRow-1,dCol);
							if(row!=-1)
							{
								RightDownDirection=true;
							}
						}
						
						// Decide which path to choose
						if(RightDownDirection && DownRightDirection || (!RightDownDirection && !DownRightDirection))
						{
							$scope.moveRightDown(sRow,sCol,dRow,dCol);
						}
						else if(RightDownDirection)
						{
							$scope.moveRightDown(sRow,sCol,dRow,dCol);
						}
						else if(DownRightDirection)
						{
							$scope.moveDownRight(sRow,sCol,dRow,dCol);
						}
					}
				
					/**************************************************************/
					//Component at Left Down position 
					/**************************************************************/
					$scope.LeftDown=function(sRow,sCol,dRow,dCol)
					{
						var UpRightDirection=false;
						var RightUpDirection=false;
						
						//check the DownRight path
						var destRow=$scope.checkUpDirection(sRow,sCol,dRow,dCol);
						if(destRow!=-1)
						{
							var col=$scope.checkRightDirection(destRow,sCol,dRow,dCol-1);
							if(col!=-1)
							{
								UpRightDirection=true;
							}
						}
						
						//check the RightDown path
						var destCol=$scope.checkRightDirection(sRow,sCol,dRow,dCol);
						if(destCol!=-1)
						{
							var row=$scope.checkUpDirection(sRow,destCol,dRow+1,dCol);
							if(row!=-1)
							{
								RightUpDirection=true;
							}
						}
						
						// Decide which path to choose
						if(RightUpDirection && UpRightDirection || (!RightUpDirection && !UpRightDirection))
						{
							$scope.moveUpRight(sRow,sCol,dRow,dCol);
						}
						else if(RightUpDirection)
						{
							$scope.moveRightUp(sRow,sCol,dRow,dCol);
						}
						else if(UpRightDirection)
						{
							$scope.moveUpRight(sRow,sCol,dRow,dCol);
						}
					}
				
					/**************************************************************/
					//Component at Right Up position 
					/**************************************************************/
					$scope.RightUp=function(sRow,sCol,dRow,dCol)
					{
						var DownLeftDirection=false;
						var LeftDownDirection=false;
						
						//check the DownLeft path
						var destRow=$scope.checkDownDirection(sRow,sCol,dRow,dCol);
						if(destRow!=-1)
						{
							var col=$scope.checkLeftDirection(destRow,sCol,dRow,dCol+1);
							if(col!=-1)
							{
								DownLeftDirection=true;
							}
						}
						
						//check the RightDown path
						var destCol=$scope.checkLeftDirection(sRow,sCol,dRow,dCol);
						if(destCol!=-1)
						{
							var row=$scope.checkDownDirection(sRow,destCol,dRow-1,dCol);
							if(row!=-1)
							{
								LeftDownDirection=true;
							}
						}
						
						// Decide which path to choose
						if(LeftDownDirection && DownLeftDirection || (!LeftDownDirection && !DownLeftDirection))
						{
							$scope.moveLeftDown(sRow,sCol,dRow,dCol);
						}
						else if(LeftDownDirection)
						{
							$scope.moveLeftDown(sRow,sCol,dRow,dCol);
						}
						else if(DownLeftDirection)
						{
							$scope.moveDownLeft(sRow,sCol,dRow,dCol);
						}
					}
					
					/**************************************************************/
					//Component at Right Down position 
					/**************************************************************/
					$scope.RightDown=function(sRow,sCol,dRow,dCol)
					{
						var LeftUpDirection=false;
						var UpLeftDirection=false;
						
						//check the UpLeft path
						var destRow=$scope.checkUpDirection(sRow,sCol,dRow,dCol);
						if(destRow!=-1)
						{
							var col=$scope.checkLeftDirection(destRow,sCol,dRow,dCol+1);
							if(col!=-1)
							{
								UpLeftDirection=true;
							}
						}
						
						//check the RightDown path
						var destCol=$scope.checkLeftDirection(sRow,sCol,dRow,dCol);
						if(destCol!=-1)
						{
							var row=$scope.checkUpDirection(sRow,destCol,dRow+1,dCol);
							if(row!=-1)
							{
								LeftUpDirection=true;
							}
						}
						
						// Decide which path to choose
						if(LeftUpDirection && UpLeftDirection || (!LeftUpDirection && !UpLeftDirection))
						{
							$scope.moveLeftUp(sRow,sCol,dRow,dCol);
						}
						else if(LeftUpDirection)
						{
							$scope.moveLeftUp(sRow,sCol,dRow,dCol);
						}
						else if(UpLeftDirection)
						{
							$scope.moveUpLeft(sRow,sCol,dRow,dCol);
						}
					}
					
					/**************************************************************/
					//Move  RightDown
					/**************************************************************/
					$scope.moveRightDown=function(sRow,sCol,dRow,dCol)
					{
						var obsticleCol;
						var obsticleRow;
						
						//mark direction for source cell
						if(!$scope.isComponentCell(sRow,sCol))
						{
							$scope.markConnectionCell(sRow,sCol,$scope.rightDir);
						}
						
						//move right
						if((obsticleCol=$scope.moveRight(sRow,sCol,dRow,dCol))==9999)
						{
							$scope.remove(sRow,dCol,"RIGHT");
							$scope.markConnectionCell(sRow,dCol,$scope.downDir);
							if((obsticleRow=$scope.moveDown(sRow,dCol,dRow-1,dCol))!=9999)
							{
								$scope.remove(obsticleRow,dCol,"DOWN");
								$scope.markConnectionCell(obsticleRow,dCol,$scope.leftDir);
								//check if the obsticleRow is same as sRow, 
								if(obsticleRow==sRow)
								{
									//Un connect the (obsticleRow,sCol)	
									$scope.remove(obsticleRow,dCol,"LEFT");
								}
									
								$scope.LeftUp(obsticleRow,dCol-1,dRow,dCol);
								;
							}
						}
						else
						{
							$scope.remove(sRow,obsticleCol,"RIGHT");
							$scope.markConnectionCell(sRow,obsticleCol,$scope.downDir);
							//increment row
							++sRow;
							//obsticle at right path
							if($scope.getRelativeDirection(sRow,obsticleCol,dRow,dCol)=="LEFTUP")
							{
								$scope.LeftUp(sRow,obsticleCol,dRow,dCol);
							}
							else if($scope.getRelativeDirection(sRow,obsticleCol,dRow,dCol)=="LEFT")
							{
								$scope.markConnectionCell(sRow,obsticleCol,$scope.rightDir);
								$scope.Left(sRow,obsticleCol,dRow,dCol);
							}
							else
							{
								console.log("******************************************************************");
								console.log("Exception occured at moveRightDown functionwhile handling obsticle");
								console.log("******************************************************************");
							}
						}						
					}
				
					/**************************************************************/
					//Move  DownRight
					/**************************************************************/
					$scope.moveDownRight=function(sRow,sCol,dRow,dCol)
					{
						var obsticleRow;
						var obsticleCol;
						
						//mark direction for source cell
						if(!$scope.isComponentCell(sRow,sCol))
						{
							$scope.markConnectionCell(sRow,sCol,$scope.downDir);
						}
						
						//move Down
						if((obsticleRow=$scope.moveDown(sRow,sCol,dRow,dCol))==9999)
						{
							$scope.remove(dRow,sCol,"DOWN");
							$scope.markConnectionCell(dRow,sCol,$scope.rightDir);
							if((obsticleCol=$scope.moveRight(dRow,sCol,dRow,dCol-1))!=9999)
							{
								$scope.remove(dRow-1,obsticleCol,"RIGHT");
								$scope.markConnectionCell(dRow-1,obsticleCol,$scope.upDir);
								//check if the obsticleCol is same as sCol 
								if(obsticleCol==sCol)
								{
									//Un connect the (obsticleRow,sCol)	
									$scope.remove(dRow,obsticleCol,"UP");
								}
								//obsticle at down path
								$scope.LeftUp(dRow-1,obsticleCol,dRow,dCol);
								;
							}
						}
						else
						{
							//mark the new column as connect b4 callong recursion
							$scope.remove(obsticleRow,sCol,"DOWN");
							$scope.markConnectionCell(obsticleRow,sCol,rightDir);
							sCol++;
							//obsticle at right path
							if($scope.getRelativeDirection(obsticleRow,sCol,dRow,dCol)=="LEFTUP")
							{
								$scope.LeftUp(obsticleRow,sCol,dRow,dCol);
							}
							else if($scope.getRelativeDirection(obsticleRow,sCol,dRow,dCol)=="UP")
							{
								$scope.markConnectionCell(sRow,obsticleCol,$scope.downDir);
								$scope.Left(obsticleRow,sCol,dRow,dCol);
							}
							else
							{
								console.log("******************************************************************");
								console.log("Exception occured at moveDownRight functionwhile handling obsticle");
								console.log("******************************************************************");
							}
						}						
					}

					/**************************************************************/
					//Move  UpRight - 3rd Quadant :called from LeftDown
					/**************************************************************/
					$scope.moveUpRight=function(sRow,sCol,dRow,dCol)
					{
						var obsticleRow;
						var obsticleCol;
						
						//mark direction for source cell
						if(!$scope.isComponentCell(sRow,sCol))
						{
							$scope.markConnectionCell(sRow,sCol,$scope.upDir);
						}
						
						//move Up
						if((obsticleRow=$scope.moveUp(sRow,sCol,dRow,dCol))==9999)
						{	
							$scope.remove(dRow,sCol,"UP");
							$scope.markConnectionCell(dRow,sCol,$scope.rightDir);
							if((obsticleCol=$scope.moveRight(dRow,sCol,dRow,dCol-1))!=9999)
							{
								$scope.remove(dRow,obsticleCol,"RIGHT");
								$scope.markConnectionCell(dRow,obsticleCol,$scope.downDir);
								//check if the obsticleCol is same as sCol 
								if(obsticleCol==sCol)
								{
									$scope.remove(dRow,obsticleCol,"DOWN");
								}
								//obsticle at down path
								$scope.LeftDown(dRow+1,obsticleCol,dRow,dCol);
								;
							}
						}
						else
						{
							$scope.remove(obsticleRow,sCol,"UP");
							$scope.markConnectionCell(obsticleRow,sCol,$scope.rightDir);
							//mark the new column as connect b4 calling recursion
							++sCol;
							//obsticle at right path
							if($scope.getRelativeDirection(obsticleRow,sCol,dRow,dCol)=="LEFTDOWN")
							{
								$scope.LeftDown(obsticleRow,sCol,dRow,dCol);
							}
							else if($scope.getRelativeDirection(obsticleRow,sCol,dRow,dCol)=="DOWN")
							{
								$scope.markConnectionCell(obsticleRow,sCol,$scope.upDir);
								$scope.Up(sRow,++obsticleCol,dRow,dCol);
							}
							else
							{
								console.log("******************************************************************");
								console.log("Exception occured at moveUpRight functionwhile handling obsticle");
								console.log("******************************************************************");
							}
						}	
					}

					/**************************************************************/
					//Move  RightUp  - 3rd Quadant called from LeftDown
					/**************************************************************/
					$scope.moveRightUp=function(sRow,sCol,dRow,dCol)
					{
						var obsticleCol;
						var obsticleRow;
						
						//mark direction for source cell
						if(!$scope.isComponentCell(sRow,sCol))
						{
							$scope.markConnectionCell(sRow,sCol,$scope.rightDir);
						}
						
						//move right
						if((obsticleCol=$scope.moveRight(sRow,sCol,dRow,dCol))==9999)
						{
							$scope.remove(sRow,dCol,"RIGHT");
							$scope.markConnectionCell(sRow,dCol,$scope.upDir);
							if((obsticleRow=$scope.moveUp(sRow,dCol,dRow+1,dCol))!=9999)
							{
								$scope.remove(obsticleRow,dCol,"UP");
								$scope.markConnectionCell(obsticleRow,dCol,$scope.leftDir);
								//check if the obsticleRow is same as sRow, 
								if(obsticleRow==sRow)
								{
									$scope.remove(obsticleRow,dCol,"LEFT");
								}
								$scope.LeftDown(obsticleRow,dCol-1,dRow,dCol);
							}
						}
						else
						{
							$scope.remove(sRow,obsticleCol,"RIGHT");
							$scope.markConnectionCell(sRow,obsticleCol,$scope.upDir);
							sRow--;
							//obsticle at right path
							if($scope.getRelativeDirection(sRow,obsticleCol,dRow,dCol)=="LEFTDOWN")
							{
								$scope.LeftDown(sRow,obsticleCol,dRow,dCol);
							}
							else if($scope.getRelativeDirection(sRow,obsticleCol,dRow,dCol)=="LEFT")
							{
								$scope.Left(sRow,obsticleCol,dRow,dCol);
							}
							else
							{
								console.log("******************************************************************");
								console.log("Exception occured at moveRightUp functionwhile handling obsticle");
								console.log("******************************************************************");
							}
						}	
					}
					
					/**************************************************************/
					//Move  LeftDown - 2nd Quadant
					/**************************************************************/
					$scope.moveLeftDown=function(sRow,sCol,dRow,dCol)  
					{
						var obsticleCol;
						var obsticleRow;
						
						//mark direction for source cell
						if(!$scope.isComponentCell(sRow,sCol))
						{
							$scope.markConnectionCell(sRow,sCol,$scope.leftDir);
						}
						
						//move Left
						if((obsticleCol=$scope.moveLeft(sRow,sCol,dRow,dCol))==9999)
						{
							$scope.remove(sRow,dCol,"LEFT");
							$scope.markConnectionCell(sRow,dCol,$scope.downDir);
							if((obsticleRow=$scope.moveDown(sRow,dCol,dRow-1,dCol))!=9999)
							{
								$scope.remove(obsticleRow,dCol,"DOWN");
								$scope.markConnectionCell(obsticleRow,dCol,$scope.rightDir);
								//check if the obsticleRow is same as sRow, 
								if(obsticleRow==sRow)
								{
									$scope.remove(obsticleRow,dCol,"RIGHT");
								}
									
								$scope.RightUp(obsticleRow,dCol+1,dRow,dCol);
							}
						}
						else
						{
							
							$scope.remove(sRow,obsticleCol,"LEFT");
							$scope.markConnectionCell(sRow,obsticleCol,$scope.downDir);
							sRow++;
							//obsticle at right path
							if($scope.getRelativeDirection(sRow,obsticleCol,dRow,dCol)=="RIGHTUP")
							{
								$scope.RightUp(sRow,obsticleCol,dRow,dCol);
							}
							else if($scope.getRelativeDirection(sRow,obsticleCol,dRow,dCol)=="RIGHT")
							{
								$scope.Right(sRow,obsticleCol,dRow,dCol);
							}
							else
							{
								console.log("******************************************************************");
								console.log("Exception occured at moveRightDown functionwhile handling obsticle");
								console.log("******************************************************************");
							}
						}
					}
					
					/**************************************************************/
					//Move  DownLeft - 2nd Quadant
					/**************************************************************/
					$scope.moveDownLeft=function(sRow,sCol,dRow,dCol)
					{
						var obsticleCol;
						var obsticleRow;
						
						//mark direction for source cell
						if(!$scope.isComponentCell(sRow,sCol))
						{
							$scope.markConnectionCell(sRow,sCol,$scope.downDir);
						}
						
						//move Left
						if((obsticleRow=$scope.moveDown(sRow,sCol,dRow,dCol))==9999)
						{
							$scope.remove(dRow,sCol,"DOWN");
							$scope.markConnectionCell(dRow,sCol,$scope.leftDir);
							if((obsticleCol=$scope.moveLeft(dRow,sCol,dRow,dCol+1))!=9999)
							{
								$scope.remove(dRow,obsticleCol,"LEFT");
								$scope.markConnectionCell(dRow,obsticleCol,$scope.upDir);
								//check if the obsticleRow is same as sRow, 
								if(obsticleCol==sCol)
								{
									$scope.remove(dRow,obsticleCol,"UP");
								}
									
								$scope.RightUP(dRow-1,obsticleCol,dRow,dCol);
							}
						}
						else
						{
							$scope.remove(obsticleRow,sCol,"DOWN");
							$scope.markConnectionCell(obsticleRow,sCol,$scope.leftDir);
							sCol--;
							//obsticle at right path
							if($scope.getRelativeDirection(obsticleRow,sCol,dRow,dCol)=="RIGHTUP")
							{
								$scope.RightUp(obsticleRow,sCol,dRow,dCol);
							}
							else if($scope.getRelativeDirection(sRow,obsticleCol,dRow,dCol)=="UP")
							{
								$scope.Up(obsticleRow,sCol,dRow,dCol);
							}
							else
							{
								console.log("******************************************************************");
								console.log("Exception occured at moveRightDown functionwhile handling obsticle");
								console.log("******************************************************************");
							}
						}
					}
					
					/**************************************************************/
					//Move  LeftUp - 2nd Quadant
					/**************************************************************/
					$scope.moveLeftUp=function(sRow,sCol,dRow,dCol)
					{
						var obsticleCol;
						var obsticleRow;
						
						//mark direction for source cell
						if(!$scope.isComponentCell(sRow,sCol))
						{
							
							$scope.markConnectionCell(sRow,sCol,$scope.leftDir);
						}
						
						//move Left
						if((obsticleCol=$scope.moveLeft(sRow,sCol,dRow,dCol))==9999)
						{
							$scope.remove(sRow,dCol,"LEFT");
							$scope.markConnectionCell(sRow,dCol,$scope.upDir);
							if((obsticleRow=$scope.moveUp(sRow,dCol,dRow+1,dCol))!=9999)
							{
								$scope.remove(obsticleRow,dCol,"UP");
								$scope.markConnectionCell(obsticleRow,dCol,$scope.rightDir);
								//check if the obsticleRow is same as sRow, 
								if(obsticleRow==sRow)
								{
									$scope.remove(obsticleRow,dCol,"RIGHT");
								}
									
								$scope.RightDown(obsticleRow,dCol-1	,dRow,dCol);
							}
						}
						else
						{
							$scope.remove(sRow,obsticleCol,"LEFT");
							$scope.markConnectionCell(sRow,obsticleCol,$scope.upDir);
							sRow--;
							//obsticle at right path
							if($scope.getRelativeDirection(sRow,obsticleCol,dRow,dCol)=="RIGHTDOWN")
							{
								$scope.RightDown(sRow,obsticleCol,dRow,dCol);
							}
							else if($scope.getRelativeDirection(sRow,obsticleCol,dRow,dCol)=="RIGHT")
							{
								$scope.Rigt(sRow,obsticleCol,dRow,dCol);
							}
							else
							{
								console.log("******************************************************************");
								console.log("Exception occured at moveRightDown functionwhile handling obsticle");
								console.log("******************************************************************");
							}
						}
					}
					
					/**************************************************************/
					//Move  UpLeft - 2nd Quadant
					/**************************************************************/
					$scope.moveUpLeft=function(sRow,sCol,dRow,dCol)
					{
						var obsticleCol;
						var obsticleRow;
						
						//mark direction for source cell
						if(!$scope.isComponentCell(sRow,sCol))
						{
							$scope.markConnectionCell(sRow,sCol,$scope.uptDir);
						}
						
						//move Left
						if((obsticleRow=$scope.moveUp(sRow,sCol,dRow,dCol))==9999)
						{
							$scope.remove(dRow,sCol,"UP");
							$scope.markConnectionCell(dRow,sCol,$scope.leftDir);
							if((obsticleCol=$scope.moveLeft(dRow,sCol,dRow,dCol+1))!=9999)
							{
								$scope.remove(dRow,obsticleCol,"LEFT");
								$scope.markConnectionCell(dRow,obsticleCol,$scope.downDir);
								if(obsticleCol==sCol)
								{
									$scope.remove(sRow,obsticleCol,"DOWN");
								}
								$scope.RightDown(sRow+1,obsticleCol,dRow,dCol);
							}
						}
						else
						{
							$scope.remove(obsticleRow,sCol,"UP");
							$scope.markConnectionCell(obsticleRow,sCol,$scope.leftDir);
							sCol++;
							//obsticle at right path
							if($scope.getRelativeDirection(obsticleRow,sCol,dRow,dCol)=="RIGHTDOWN")
							{
								$scope.RightDown(obsticleRow,sCol,dRow,dCol);
							}
							else if($scope.getRelativeDirection(obsticleRow,sCol,dRow,dCol)=="DOWN")
							{
								$scope.Down(obsticleRow,sCol,dRow,dCol);
							}
							else
							{
								console.log("******************************************************************");
								console.log("Exception occured at moveRightDown functionwhile handling obsticle");
								console.log("******************************************************************");
							}
						}
					}
					
					/**************************************************************/
					//Move to the right direction
					/**************************************************************/
					$scope.moveRight=function(sRow,sCol,dRow,dCol)
					{
						while(sCol<dCol)
						{
							if($scope.isComponentCell(sRow,++sCol))
							{
								return --sCol;
							}
							else
							{
								$scope.markConnectionCell(sRow,sCol,$scope.rightDir);
							}
						}
						return 9999;
					}
					
					/**************************************************************/
					//Move to the left direction
					/**************************************************************/
					$scope.moveLeft=function(sRow,sCol,dRow,dCol)
					{
						while(sCol>dCol)
						{
							if($scope.isComponentCell(sRow,--sCol))
							{
								return ++sCol;
							}
							else
							{
								$scope.markConnectionCell(sRow,sCol,$scope.leftDir);
							}
						}
						return 9999;
					}
					/**************************************************************/
					//Move to the right direction
					/**************************************************************/
					$scope.moveUp=function(sRow,sCol,dRow,dCol)
					{
						while(sRow>dRow)
						{
							if($scope.isComponentCell(--sRow,sCol))
							{
								return ++sRow;
							}
							else
							{
								$scope.markConnectionCell(sRow,sCol,$scope.upDir);
							}
						}
						return 9999;
					}
					/**************************************************************/
					//Move to the right direction
					/**************************************************************/
					$scope.moveDown=function(sRow,sCol,dRow,dCol)
					{
						while(sRow<dRow)
						{
							if($scope.isComponentCell(++sRow,sCol))
							{
								return --sRow;
							}
							else
							{
								$scope.markConnectionCell(sRow,sCol,$scope.downDir);
							}
						}
						return 9999;
					}
					
				/*	*//**************************************************************//*
					//Mark the cell as connected
					*//**************************************************************//*
					$scope.markConnectionCell=function(Row,Col,direction)
					{
						if($scope.gridMatrix[Row][Col]==undefined)
						{
							$scope.gridMatrix[Row][Col]={};
						}
						
						switch(direction)
						{
						case "RIGHT" : 	$scope.gridMatrix[Row][Col].rightDir=direction;break;
						case "LEFT" : 	$scope.gridMatrix[Row][Col].leftDir=direction;break;
						case "UP" : 	$scope.gridMatrix[Row][Col].upDir=direction;break;
						case "DOWN" : 	$scope.gridMatrix[Row][Col].downDir=direction;break; 
						}
						
						$scope.gridMatrix[Row][Col].connectedCell=true;
						$scope.connector.push({row :Row, col :Col,dir : direction});
					}*/
					
					/**************************************************************/
					//Mark the cell as connected
					/**************************************************************/
					$scope.markConnectionCell=function(Row,Col,direction)
					{
						if($scope.gridMatrix[Row][Col]==undefined)
						{
							$scope.gridMatrix[Row][Col]={};
						}
						
						switch(direction)
						{
						case "RIGHT" : 	if($scope.gridMatrix[Row][Col].rightDir!=null)
										{$scope.gridMatrix[Row][Col].rightCount+=1;}
										else{	
											$scope.gridMatrix[Row][Col].rightCount=1;
											$scope.gridMatrix[Row][Col].rightDir=direction;
											}
										break;
						case "LEFT" : 	if($scope.gridMatrix[Row][Col].leftDir!=null)
										{$scope.gridMatrix[Row][Col].leftCount+=1;}
										else{	
											$scope.gridMatrix[Row][Col].leftCount=1;
											$scope.gridMatrix[Row][Col].leftDir=direction;
											}
										break;
										
						case "UP" : 	if($scope.gridMatrix[Row][Col].upDir!=null)
											{$scope.gridMatrix[Row][Col].upCount+=1;}
											else{	
												$scope.gridMatrix[Row][Col].upCount=1;
												$scope.gridMatrix[Row][Col].upDir=direction;
												}
										break;
						case "DOWN" : 	if($scope.gridMatrix[Row][Col].downDir!=null)
										{$scope.gridMatrix[Row][Col].downCount+=1;}
										else{	
											$scope.gridMatrix[Row][Col].downCount=1;
											$scope.gridMatrix[Row][Col].downDir=direction;
											}
										break;
						}
						
						$scope.gridMatrix[Row][Col].connectedCell=true;
						$scope.connector.push({row :Row, col :Col,dir : direction});
					}
					
					/**************************************************************/
					//Check the right side path : exclude source coordinate and include dest coordinate
					/**************************************************************/
					$scope.checkRightDirection=function(sRow,sCol,dRow,dCol)
					{
						while(sCol<dCol)
						{
							if($scope.isComponentCell(sRow,++sCol))
							{
								return -1;
							}
							
						}
						return sCol;
					}
				
					/**************************************************************/
					//Check the left side path :  exclude source coordinate and include dest coordinate
					/**************************************************************/
					$scope.checkLeftDirection=function(sRow,sCol,dRow,dCol)
					{
						while(sCol>dCol)
						{
							if($scope.isComponentCell(sRow,--sCol))
							{
								return -1;
							}
							
						}
						return sCol;
					}


					/**************************************************************/
					//Check the UP side path :  exclude source coordinate and include dest coordinate
					/**************************************************************/
					$scope.checkUpDirection=function(sRow,sCol,dRow,dCol)
					{
						while(sRow>dRow)
						{
							if($scope.isComponentCell(--sRow,sCol))
							{
								return -1;
							}
							
						}
						return sRow;
					}
					
					/**************************************************************/
					//Check the Down side path :  exclude source coordinate and include dest coordinate
					/**************************************************************/
					$scope.checkDownDirection=function(sRow,sCol,dRow,dCol)
					{
						while(sRow<dRow)
						{
							if($scope.isComponentCell(++sRow,sCol))
							{
								return -1;
							}
							
						}
						return sRow;
					}
					
					
					/**************************************************************/
					//verify the cell having any component 
					/**************************************************************/
					$scope.isComponentCell=function(sRow,sCol)
					{
						if(typeof $scope.gridMatrix[sRow][sCol]!="undefined" && $scope.gridMatrix[sRow][sCol]!=null && $scope.gridMatrix[sRow][sCol].name)
						{
							return true;
						}
						else
						{
							return false;
						}
					}
					
					/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++/
					/+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++/
					/+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++/
					//											Utility functions 
					/+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++/
					/+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++/
					/++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

					
					/**************************************************************/
					//Reset state
					/**************************************************************/
					$scope.reset=function()
					{
						$scope.connections.sourceRow=null;
						$scope.connections.sourceColumn=null;
						$scope.connections.destinationRow=null;
						$scope.connections.destinationColumn=null;
						//$scope.componentIndex=1;
						$scope.mode="Design";
					}
					
					/**************************************************************/
					//Call Alert Box Blink Logic 
					/**************************************************************/
					$scope.blink=function()
					{
						var index=1;
							var blinkTimer = setInterval(function(){
									if(index%2==0)
									{
										$("#alertBox").removeClass("panel-red");
										$("#alertBox").addClass("panel-green");
										index++;
									}
									else
									{
										$("#alertBox").removeClass("panel-green");
										$("#alertBox").addClass("panel-red");
										index++;
									}
								
							}, $scope.blinkFrequency);
							setTimeout(function(){  clearInterval(blinkTimer);}, $scope.blinkTimeOut);
					}
					
					/**************************************************************/
					//remove component from gridMatrix
					/**************************************************************/
					$scope.remove=function(row,col,dir)
					{
						if(dir==undefined)
						{
							$scope.gridMatrix[row][col]=null;
						}
						else
						{
							switch(dir)
							{
							case "RIGHT" : 	if(--$scope.gridMatrix[row][col].rightCount==0) $scope.gridMatrix[row][col].rightDir=null;break;
							case "LEFT" :  	if(--$scope.gridMatrix[row][col].leftCount==0) $scope.gridMatrix[row][col].leftDir=null;break;
							case "UP" :  	if(--$scope.gridMatrix[row][col].upCount==0) $scope.gridMatrix[row][col].upDir=null;break;
							case "DOWN" :  	if(--$scope.gridMatrix[row][col].downCount==0) $scope.gridMatrix[row][col].downDir=null;break;
							}
							$scope.removeContext(row,col,$scope.connector);
						}
					}


					/**************************************************************/
					//remove component 
					/*************************************************************/
					$scope.removeContext=function(row,col,connections)
					{
						for(let i=0;i<connections.length;i++)
						{
							if(connections[i].row==row && connections[i].col==col)
							{
								connections.splice(i,1);
							}
						}
					}
					
					/**************************************************************/
					//remove component List
					/**************************************************************/
					$scope.removeList=function(arr)
					{
						for(let j=0;j<arr.length;j++)
						{
							$scope.remove(arr[j].row,arr[j].col,arr[j].dir);
						}
					}
					
					/**************************************************************/
					//Cancel component 
					/**************************************************************/
					$scope.cancelComponent=function(row,col)
					{
						if($scope.gridMatrix[row][col].connections!=undefined && $scope.gridMatrix[row][col].connections.length>0)
						{
							$scope.removeCircuitConnection(row,col);
							$scope.removeConnection(row,col);
						}
						$scope.removeComponent(row,col);
						
					}
					
					/**************************************************************/
					//remove from the Circuit Connection 
					/**************************************************************/
					$scope.removeCircuitConnection=function(row,col)
					{
						var id=$scope.gridMatrix[row][col].id;
						
						for(let i=0;i<$scope.circuitConnection.length;i++)
						{
							if($scope.circuitConnection[i].srcid==id || $scope.circuitConnection[i].destid==id)
							{
								$scope.circuitConnection.splice(i,1);
							}
						}
					}
					
					/**************************************************************/
					//remove component from context 
					/**************************************************************/
					$scope.removeComponent=function(row,col)
					{
						$scope.appContext.designSchema.component[$scope.gridMatrix[row][col].id-1]={};// -------------> remove this element from the array
						$scope.gridMatrix[row][col]=null;
					}
					
					/**************************************************************/
					//search Component in context 
					/**************************************************************/
					$scope.removeConnection=function(row,col)
					{
						//remove target component connection[] entry
						for(let i=0;i<$scope.gridMatrix[row][col].componentConnectedpairs.length;i++)
						{
							for(let j=0;j<$scope.gridMatrix[$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.row][$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.col].connections.length;j++)
							{
								if($scope.gridMatrix[row][col].id==$scope.gridMatrix[$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.row][$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.col].connections[j].targetId)
								{
									$scope.gridMatrix[$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.row][$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.col].connections.splice(j, 1);
								}
								if($scope.gridMatrix[row][col].id==$scope.gridMatrix[$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.row][$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.col].componentConnectedpairs[j].targetComponentId)
								{
									$scope.gridMatrix[$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.row][$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.col].componentConnectedpairs.splice(j, 1);
								}
							}
						}
						$scope.gridMatrix[row][col].componentConnectedpairs=[];
						
						//Remove from context
						$scope.removeFromContext(row,col);
						
						
						//Remove directions from the grid cells
						for(let i=0;i<$scope.gridMatrix[row][col].connections.length;i++)
						{
							for(let j=0;j<$scope.gridMatrix[row][col].connections[i].ConnectionCells.length;j++)
							{
								$scope.remove($scope.gridMatrix[row][col].connections[i].ConnectionCells[j].row,$scope.gridMatrix[row][col].connections[i].ConnectionCells[j].col,$scope.gridMatrix[row][col].connections[i].ConnectionCells[j].dir);
							}
							$scope.setRelativeDirections($scope.gridMatrix[row][col].connections[i].ConnectionCells);
						}
					}
					
					
					/**************************************************************/
					//Remove entry from the context 
					/**************************************************************/
					$scope.removeFromContext=function(row,col)
					{
						var componentId=$scope.gridMatrix[row][col].id;
						for(let i=0;i<$scope.appContext.designSchema.connection.length;i++)
						{
							if($scope.appContext.designSchema.connection[i].srcid==componentId || $scope.appContext.designSchema.connection[i].destid==componentId)
							{
								$scope.appContext.designSchema.connection.splice(i,1);
							}
						}
							
					}
					
					/**************************************************************/
					//Clear grid 
					/**************************************************************/
					$scope.clear=function()
					{
						/*if($scope.sureToClear==true)
						{*/
							$scope.gridMatrix=null;
							$scope.loadComponent();
							//clear app context;
							$scope.appContext.undo=[];
							$scope.appContext.designSchema.component=[];
							$scope.appContext.designSchema.connection=[];
							$scope.selectedComponenName="No Component Selected";
							$scope.componentIndex=1;
							$scope.reset();
							$scope.circuitConnection=[];
						//}
					}
					
					/**************************************************************/
					//Undo grid
					/**************************************************************/
					$scope.undoActivity=function()
					{
						var element=$scope.appContext.undo.pop();
						if(element.type=="COMPONENT")
						{
							$scope.componentIndex--;
							$scope.remove(element.coordinate.row,element.coordinate.col);
							$scope.appContext.designSchema.component.pop();
							
						}
						else if(element.type=="CONNECTOR")
						{
							$scope.connectionIndex--;
							
							for(let i=0;i<element.coordinate.length;i++)
							{
								$scope.remove(element.coordinate[i].row,element.coordinate[i].col);
							}
							$scope.appContext.designSchema.connection.pop();
							$scope.circuitConnection.pop();
						}
					}
					
					/**************************************************************/
					//Calculate relative direction 
					/**************************************************************/
					$scope.getRelativeDirection=function(sRow,sCol,dRow,dCol)
					{
						//calculate directions
						if(sCol<dCol && sRow<dRow)
						{
							// source is left and up	
							return "LEFTUP";
						}
						else if(sCol<dCol && sRow>dRow)
						{
							//source is left and down
							return "LEFTDOWN";
						}
						else if(sCol>dCol && sRow>dRow)
						{
							// source is right and down
							return "RIGHTDOWN";
						}
						else if(sCol>dCol && sRow<dRow)
						{
							// source is right and up
							return "RIGHTUP";
						}
						else if(sCol<dCol && sRow==dRow)
						{
							// source is left and on same row
							return "LEFT";
						}
						else if(sCol>dCol && sRow==dRow)
						{
							// source is right and on same row
							return "RIGHT";
						}
						else if(sCol==dCol && sRow>dRow)
						{
							// source is down and on same column
							return "DOWN";
						}
						else if(sCol==dCol && sRow<dRow)
						{
							// source is up and on same column
							return "UP";
						}
					}
					
					/**************************************************************/
					//set relative direction 
					/**************************************************************/
					$scope.setRelativeDirections=function(connector)
					{
						for(let i=0;i<connector.length;i++){
							if($scope.gridMatrix[connector[i].row][connector[i].col].downDir=='DOWN' && $scope.gridMatrix[connector[i].row][connector[i].col].upDir=='UP' && $scope.gridMatrix[connector[i].row][connector[i].col].rightDir=='RIGHT' && $scope.gridMatrix[connector[i].row][connector[i].col].leftDir=='LEFT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="DOWN-UP-RIGHT-LEFT";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].downDir==='DOWN' &&  $scope.gridMatrix[connector[i].row][connector[i].col].upDir==='UP' && $scope.gridMatrix[connector[i].row][connector[i].col].rightDir==='RIGHT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="DOWN-UP-RIGHT";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].downDir==='DOWN' && $scope.gridMatrix[connector[i].row][connector[i].col].upDir==='UP' && $scope.gridMatrix[connector[i].row][connector[i].col].leftDir==='LEFT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="DOWN-UP-LEFT";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].upDir==='UP' && $scope.gridMatrix[connector[i].row][connector[i].col].rightDir==='RIGHT' && $scope.gridMatrix[connector[i].row][connector[i].col].leftDir==='LEFT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="UP-RIGHT-LEFT";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].downDir==='DOWN' && $scope.gridMatrix[connector[i].row][connector[i].col].rightDir==='RIGHT' && $scope.gridMatrix[connector[i].row][connector[i].col].leftDir==='LEFT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="DOWN-RIGHT-LEFT";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].rightDir==='RIGHT' && $scope.gridMatrix[connector[i].row][connector[i].col].leftDir==='LEFT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="RIGHT-LEFT";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].downDir==='DOWN' && $scope.gridMatrix[connector[i].row][connector[i].col].upDir==='UP')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="DOWN-UP";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].downDir==='DOWN' && $scope.gridMatrix[connector[i].row][connector[i].col].rightDir==='RIGHT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="DOWN-RIGHT";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].downDir==='DOWN' && $scope.gridMatrix[connector[i].row][connector[i].col].leftDir==='LEFT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="DOWN-LEFT";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].rightDir==='RIGHT' && $scope.gridMatrix[connector[i].row][connector[i].col].upDir==='UP')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="RIGHT-UP";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].leftDir==='LEFT' && $scope.gridMatrix[connector[i].row][connector[i].col].upDir==='UP')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="LEFT-UP";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].downDir==='DOWN')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="DOWN";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].upDir==='UP')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="UP";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].leftDir==='LEFT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="LEFT";
							}
							else if($scope.gridMatrix[connector[i].row][connector[i].col].rightDir==='RIGHT')
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction="RIGHT";
							}
							else
							{
								$scope.gridMatrix[connector[i].row][connector[i].col].direction=null;
							}
							
						}
					}
					/**************************************************************/
					//Correct last arrow direction 
					/**************************************************************/
					$scope.lastArrowDir=function(dRow,dCol){
						// correct the last arrow direction'
						if(dCol-1>=0 && $scope.gridMatrix[dRow][dCol-1]!=undefined && $scope.gridMatrix[dRow][dCol-1].connectedCell==true)
						{
							$scope.remove(dRow,dCol-1);
							$scope.markConnectionCell(dRow,dCol-1,$scope.rightDir);
						}
						if(dCol+1<=$scope.COLUMNS && $scope.gridMatrix[dRow][dCol+1]!=undefined && $scope.gridMatrix[dRow][dCol+1].connectedCell==true)
						{
							$scope.remove(dRow,dCol+1);
							$scope.markConnectionCell(dRow,dCol+1,$scope.leftDir);
						}
						if(dRow-1>=0 && $scope.gridMatrix[dRow-1][dCol]!=undefined && $scope.gridMatrix[dRow-1][dCol].connectedCell==true)
						{
							$scope.remove(dRow-1,dCol);
							$scope.markConnectionCell(dRow-1,dCol,$scope.downDir);
						}
						if(dRow+1<=$scope.ROWS && $scope.gridMatrix[dRow+1][dCol]!=undefined && $scope.gridMatrix[dRow+1][dCol].connectedCell==true)
						{
							$scope.remove(dRow+1,dCol);
							$scope.markConnectionCell(dRow+1,dCol,$scope.upDir);
						}
					}

					/**************************************************************/
					//Download Xml Schema 
					/**************************************************************/
					$scope.downloadXML=function()
					{
						$scope.saveJSON($scope.schemaGeneration($scope.appContext.designSchema),'circuitdesign.xml');
					}
					
					/**************************************************************/
					//Download MO Schema 
					/**************************************************************/
					$scope.downloadMO=function()
					{
						$scope.saveJSON($scope.GenerateMO($scope.appContext.designSchema),'mgp.mo');
					}
					
					/**************************************************************/
					//Download Project Schema 
					/**************************************************************/
					$scope.downloadProject=function()
					{
						var saveObj=
						{
								grid : $scope.gridMatrix,
								context : $scope.appContext,
								circuit : $scope.circuitConnection
						}
						$scope.saveJSON(saveObj,'Project.json');
					}
					
					/**************************************************************/
					//Generate Design Schema 
					/**************************************************************/
					$scope.GenerateMO=function(payload)
					{
						var body="within MicroGrid.Examples.OnePhase; "
						body+="model NewModel "
						body+=" extends Modelica.Icons.Example; "
						var component="";
						var connection="";

						var bb = [];
						var size = 0;
						
						for(let i=0;i<$scope.appContext.designSchema.component.length;i++)
						{
							if(payload.component[i]!=null && payload.component[i]!=undefined && payload.component[i].properties!=undefined)
							{
								component+=$scope.appContext.designSchema.component[i].namespace+" "+$scope.appContext.designSchema.component[i].name+"";
							
								for(let j=0;j<$scope.appContext.designSchema.component[i].properties.length;j++)
								{
									if(j==0)
									{
										component+="(";
									}

									// console.log("component details");
									// console.log("-----------------");
									// console.log($scope.appContext.designSchema.component[i]);
									if($scope.appContext.designSchema.component[i].componentOriId == 8 && $scope.appContext.designSchema.component[i].properties[j].name == "n")
									{
										bb.push([$scope.appContext.designSchema.component[i].name, "V_in", $scope.appContext.designSchema.component[i].properties[j].value]);
										bb.push([$scope.appContext.designSchema.component[i].name, "pin_N", $scope.appContext.designSchema.component[i].properties[j].value]);
										size+=2;
									}
									
									component+=$scope.appContext.designSchema.component[i].properties[j].name + "=" + $scope.appContext.designSchema.component[i].properties[j].value;
									
									if($scope.appContext.designSchema.component[i].properties.length-j>1)
									{
										component+=",";
									}
								}
								if($scope.appContext.designSchema.component[i].properties.length>0)
								{
									component+="); ";
								}
								else {
									component+="; ";
								}
							}
						}
						
						if(component.search("PV_GridTie") != -1)
						{
							component+="parameter MicroGrid.DC.PhotoVoltaics.Records.ModuleData moduleData(ImpRef = 7.61, IscRef = 8.21, VmpRef = 26.3, VocRef = 32.9, alphaIsc = 3.18e-3, alphaVoc = -0.123, ns = 54); ";
						}
						body+=component;
						body+="equation ";

						// console.log("bb array");
						// console.log("-----------------");
						// console.log(bb);
						// console.log("bb row size");
						// console.log("-----------------");
						// console.log(size);
						// console.log("bb array 1st element");
						// console.log("-----------------");
						// // for(let r=0;r<size;r++) {
						// 	for(let c=0;c<3;c++) {
						// 		console.log(bb[r][c]);
						// 	}	
						// }
						
						// adding connections
						for(let i=0;i<$scope.circuitConnection.length;i++)
						{
							console.log("circuitConnection");
							console.log($scope.circuitConnection[i]);
							if($scope.circuitConnection[i].destid == 8) {
								for(let r=0;r<size;r++) {
									for(let c=0;c<3;c++) {
										if(bb[r][c] == $scope.circuitConnection[i].destName){
											if(bb[r][c+1] == $scope.circuitConnection[i].destLink){
												connection+="connect("+$scope.circuitConnection[i].srcName +"."+$scope.circuitConnection[i].srcLink +","+ $scope.circuitConnection[i].destName+"."+$scope.circuitConnection[i].destLink+"["+bb[r][c+2]+"]"+"); ";
												bb[r][c+2] = Number(bb[r][c+2])-1;
											}
										}
									}	
								}
							} else {
							connection+="connect("+$scope.circuitConnection[i].srcName +"."+$scope.circuitConnection[i].srcLink +","+ $scope.circuitConnection[i].destName+"."+$scope.circuitConnection[i].destLink+"); ";
							}
						}
						
						body+=connection;
						body+=" end NewModel";
						return body;
					}
					
					/**************************************************************/
					//Generate Design XML Schema 
					/**************************************************************/
					$scope.schemaGeneration=function(payload) 
					{
						var header="<?xml version='1.0'?> <microgrid version='2.0'><model id='MicroGrid_Layout_1_phase'>";
						var footer="</model></microgrid>";
						$scope.body="";
						var components="";
						var connections="";
						var equationStartTag="<equation>";
						var equationEndTag="</equation>";
						var componentEndTag="</component>";

						console.log(payload.component.length);
						
							//adding components to xml 
						for(let i=0;i<payload.component.length;i++)
						{
							//components+="<component id='"+payload.component[i].id+"' name='"+payload.component[i].name+"' type='"+payload.component[i].type+"'>";
							if(payload.component[i]!=null && payload.component[i]!=undefined && payload.component[i].properties!=undefined)
							{
								components+="<component id='"+payload.component[i].id+"' name='"+payload.component[i].name+"' type='"+payload.component[i].type+"'>";
								for(let j=0;j<payload.component[i].properties.length;j++)
								{
								components+="<"+payload.component[i].properties[j].name+">"+payload.component[i].properties[j].value+"</"+payload.component[i].properties[j].name+">";   
								}
								components+=componentEndTag;
							}
							//components+=componentEndTag;
						}
						
						//adding connection to xml
						for(let i=0;i<$scope.circuitConnection.length;i++)
						{
							connections+="<connection destid='"+$scope.circuitConnection[i].destid+"' id='"+i+"' srcid='"+$scope.circuitConnection[i].srcid+"' />";
						}
						
						$scope.body=header+components+equationStartTag+connections+equationEndTag+footer;
						
						console.log("scope.body");
						console.log($scope.body);

						var parser, xmlDoc, txt, x, i;
						var component_type, component_name;
						var library, elementType, subType, element;
						// var text = "<bookstore><book>" +
						// "<title id='1'>Everyday Italian</title>" +
						// "<author>Giada De Laurentiis</author>" +
						// "<year>2005</year>" +
						// "</book></bookstore>";
						parser = new DOMParser();
						xmlDoc = parser.parseFromString($scope.body,"text/xml");
						// var demo = xmlDoc.getElementsByTagName("component")[0].getAttribute('name');
						// var demo = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
						// console.log(demo);
						var component_xml_string = "<?xml version='1.0'?><Architecture name='MicroGrid_Layout_1_phase'><Definitions>";

						// txt = "";
						x = xmlDoc.getElementsByTagName('component');
						for (i = 0; i < x.length; i++) { 
							component_type = x[i].getAttribute('type');
							component_name = x[i].getAttribute('name');
							// txt += x[i].getAttribute('name') + "\n";
							if(component_type == "FeederTie") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Components";
								element = "Transmission";	
								}
							else if(component_type == "Feeder") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Components";
								element = "Load";	
								}
							else if(component_type == "Resistive") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Components";
								element = "Load";	
								}	
							else if(component_type == "Sensor") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Components";
								element = "Sensor";	
								}
							else if(component_type == "Busbar") {
								library = "Microgrid";
								elementType = "Interfaces";
								subType = "OnePhase";
								element = "";	
								}
							else if(component_type == "TransformerBasic") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Components";
								element = "Transformers";	
								}
							else if(component_type == "PV_GridTie") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Sources";
								element = "";	
								}
							else if(component_type == "Building_load") {
								library = "Microgrid";
								elementType = "Examples";
								subType = "OnePhase";
								element = "";	
								}
							else if(component_type == "CircuitBreaker") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Components";
								element = "Breaker";	
								}
							else if(component_type == "PV_GridTie") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Sources";
								element = "";	
								}
							else if(component_type == "WindPowerPlant") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Sources";
								element = "";	
								}
							else if(component_type == "MainGrid") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Sources";
								element = "";	
								}
							else if(component_type == "Generator") {
								library = "Microgrid";
								elementType = "OnePhase";
								subType = "Sources";
								element = "";	
								}
							else if(component_type == "irradiance") {
								library = "Modelica";
								elementType = "Blocks";
								subType = "Sources";
								element = "";	
								}
							else if(component_type == "WindVelocity") {
								library = "Modelica";
								elementType = "Blocks";
								subType = "Sources";
								element = "";	
								}
							else if(component_type == "GridCapacity") {
								library = "Modelica";
								elementType = "Blocks";
								subType = "Sources";
								element = "";	
								}
							else if(component_type == "BooleanPulse") {
								library = "Modelica";
								elementType = "Blocks";
								subType = "Sources";
								element = "";	
								}

							component_xml_string += "<Library name='" + library + "'>";
							component_xml_string += "<ElementType name='" + elementType + "'>";
							component_xml_string += "<SubType name='" + subType + "'>";
							if (element != "") {
								component_xml_string += "<Element name='" + element + "'>";
							}
							component_xml_string += "<Type category='" + component_type + "' name='" + component_name + "'>"; 
							component_xml_string += "</Type></Element></SubType></ElementType></Library>";
						}
						component_xml_string += "</Definitions></Architecture>";
						
						$scope.newXMLBody = component_xml_string;
						return $scope.newXMLBody;	
					}
					
					/**************************************************************/
					//Generate Design View 
					/**************************************************************/
					$scope.showDesignXML=function()
					{
						$scope.header="<?xml version='1.0'?> <microgrid version='0.1'>	<model id='MicroGrid_Layout_1_phase'>";
						$scope.footer='</model></microgrid>';
						$scope.equationStartTag='<equation>';
						$scope.equationEndTag='</equation>';
						$scope.componentStartTag="<component id='";
						$scope.componentEndTag='</component>';
						$scope.connectionStartTag="<connection destid='";
						$scope.connectionEndTag='</connection>';
						$scope.endtag="</";
						$scope.MOheader="model NewModel";
						$scope.MOfooter='end NewModel;';
						
						$scope.propertTag=[];
						
						$scope.showGrid=!$scope.showGrid;
						
						if($scope.showGrid==false)
						{
							$scope.tiggleDesignButton="Design";
						}
						else
						{
							$scope.tiggleDesignButton="MO";
						}
					}
					
					/**************************************************************/
					//Generate Design MO View 
					/**************************************************************/
					$scope.showDesignMO=function()
					{
						$scope.MOheader="model NewModel";
						$scope.MOfooter='end NewModel;';
						$scope.showGrid=!$scope.showGrid;
						
						if($scope.showGrid==false)
						{
							$scope.tiggleDesignXMLButton="Design";
						}
						else
						{
							$scope.tiggleDesignXMLButton="XML";
						}
					}
					
					/**************************************************************/
					//Save a file as a json 
					/**************************************************************/
					$scope.saveJSON = function(data,filename) {
						    var jsonse = JSON.stringify(data);
						    var blob = new Blob([jsonse], {
						      type: "application/json"
						    });
						   
						    $scope.filename = filename || "CircuitBuilderJson";
						    saveAs(blob, $scope.filename);
						  }
					
					 $scope.method = 'GET';
				     $scope.url = 'cards.json';

				    /**************************************************************/
					//Load file from system 
					/**************************************************************/
						$scope.load= function() {
				            $scope.code = null;
				            $scope.response = null;
				            $scope.url="Project_v3.json";
				            
				            // load from file system
				            $http({method: $scope.method, url: $scope.url}).
				                then(function(response) {
				                    $scope.gridMatrix = response.data.grid;
				                    $scope.appContext = response.data.context;
				                    $scope.circuitConnection = response.data.circuit;
				                    console.log("Read file", $scope.url, "successfully.");
				                    console.log("Data ", $scope.gridMatrix);
				                }, function(response) {
				                    $scope.data = response.data || "Request failed";
				                    console.log("Error reading", $scope.url, ".");
				                });
				            
				            // set to app context
				            
				        };

				        /**************************************************************/
					//Control Generated Model
					/**************************************************************/
						$scope.controlModel= function() {
							// console.log("in");
			    //           let first = 10;
						 //  let second = 20;
						 //  fetch('http://127.0.0.1:81/add?a=' + first + '&b=' + second)
						 //    .then((response) => {
						 //      return response.json();
						 //    })
						 //    .then((myJson) => {
						 //        $scope.selectedComponentName="When I add " + first + " and " + second + " I get: " + myJson.result;
							// 	$("#alertBox").removeClass("panel-red");
							// 	$("#alertBox").addClass("panel-green");
						 //    }).catch((error) => {
						 //    	$scope.selectedComponentName="Python call error";
							// 	$("#alertBox").removeClass("panel-green");
							// 	$("#alertBox").addClass("panel-red");
						 //    });     
							window.open("http://localhost:7777/controlModel");
						 	//var run= xmlDoc('WSCRIPT.Shell').Run("dir");
						 	//var oShell = new ActiveXObject("wscript.shell");
						 }
				        
				        
				        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						// Add property
						// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						 $scope.addRow=function(table)
				        {
							 var additionalRow = {
										id:$scope.gridMatrix[$scope.propRow][$scope.propCol].componentRefID,
										saveStatus : false
									};
							 
							if(table=='manageConnection')
							{
								 if ($scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow == undefined)
								 {	
									 $scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow = [];
								 }	 
									$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionSave =false;
									$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow.push(additionalRow);
							}
							else
							{
								if ($scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList == undefined)
								 {	
									 $scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList = [];
								 }
									
									
									$scope.gridMatrix[$scope.propRow][$scope.propCol].attributeSave =false;
									$scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList.push(additionalRow);
							}
				        }
				        
				    	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						// Delete Property
						// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						$scope.deleteRow = function(index,table) {
							if(table=='manageConnection')
							{
								$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow.splice(index, 1);
								$scope.circuitConnection.splice(index,1);
							}
							else
							{
								$scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList.splice(index, 1);
								$scope.gridMatrix[$scope.propRow][$scope.propCol].properties.splice(index,1);
								$scope.saveProperties();
							}
						};
						
						 
				    	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						// Save properties
						// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						$scope.saveProperties=function()
						{
							if(!$scope.gridMatrix[$scope.propRow][$scope.propCol].attributeSave && $scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList!=undefined)
							{
								var flag=false;
								//copying properties from temp prop array to grid attribute
								for(let i=0;i<$scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList.length;i++)
								{
									if($scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList[i].saveStatus==false
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList[i].selectedProp.name!=undefined
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList[i].selectedProp.name!=null
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList[i].value!=undefined
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList[i].value!=undefined)
									{
										$scope.gridMatrix[$scope.propRow][$scope.propCol].properties.push(
												{
													name : $scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList[i].selectedProp.name,
													value : $scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList[i].value
												});
										$scope.gridMatrix[$scope.propRow][$scope.propCol].propertyList[i].saveStatus=true;
										flag=true;
									}
								}
								$scope.gridMatrix[$scope.propRow][$scope.propCol].attributeSave=flag;
							}
							if(!$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionSave && $scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow!=undefined)
							{
								var flag=false;
								for(let i=0;i<$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow.length;i++)
									{
											if($scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].saveStatus==false
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].srcName!=null 
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].srcName!=undefined
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].srcLink!=null 
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].srcLink!=undefined
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].destLink!=null 
											&& $scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].destLink!=undefined)
										{	
											$scope.circuitConnection.push(
													{
														srcName : 	$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].srcName.name,
														srcLink : 	$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].srcLink,
														destName : 	$scope.gridMatrix[$scope.propRow][$scope.propCol].name,
														destLink : 	$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].destLink,
														srcid	: 	$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].srcName.id,
														destid : 	$scope.gridMatrix[$scope.propRow][$scope.propCol].id
													});
											$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionRow[i].saveStatus=true;
											flag=true;
										}
									}
								$scope.gridMatrix[$scope.propRow][$scope.propCol].connectionSave=flag;
							}
						}
						
						/**************************************************************/
						//Add Terminal work flow 
						/**************************************************************/
						$scope.addProperty=function(row,col)
						{
							$scope.propRow=row;
							$scope.propCol=col;
							
							// get terminals possible values
							if($scope.gridMatrix[row][col].terminalValue==undefined)
							{
								$scope.gridMatrix[row][col].terminalValue=[];
							}
							
							if($scope.gridMatrix[row][col].componentConnectedpairs!=undefined)
							{
								for(let i=0;i<$scope.gridMatrix[row][col].componentConnectedpairs.length;i++)
								{
										if($scope.gridMatrix[row][col].componentConnectedpairs[i].flow=="inward")
										{
											if(!$scope.isExist($scope.gridMatrix[row][col].terminalValue,$scope.gridMatrix[$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.row][$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.col].id))
											{
												$scope.gridMatrix[row][col].terminalValue.push(
														{
															name : 	$scope.gridMatrix[$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.row][$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.col].name,
															id 	 : 	$scope.gridMatrix[$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.row][$scope.gridMatrix[row][col].componentConnectedpairs[i].coordinate.col].id
														});
											}
										}
								}
							}
						}
						
						$scope.isExist=function(terminalValue,id)
						{
							for(let i=0;i<terminalValue.length;i++)
							{
								if(terminalValue[i].id==id)
								{
									return true;
								}
							}
							return false;
						}
						
						$scope.saveSettings=function()
						{
							$scope.gridMatrix=null;
							$scope.loadComponent();						}
					
				} ]);