# Monster Hunter Guild technology selection

This file provides breif information about architectural software patterns and the two most common ORM packages (TypeORM & Prisma). Alongside the given information, there are also two tables comparing these technologies using a set of parameters that allow for a rating to be assigned. The technology with the highest rating will be the most suitable for the project. 
___

# Architectural Pattern
This section will compare three architectural patterns: _n_layer, hexagonal and microservices_. To compare these patterns we must investigate them first and then make de comparison.

## Investigation
Here is a brief definition of each patter, mentioning its advantages and disadvantages.

#### 1. *n_layer*
{N_LAYER_DESC}

#### 2. *microservices*
{MICROSERVICES_DESC}

#### 3. *hexagonal*
{HEXAGONAL_DESC}

## Comparison
Given a short definition for each pattern, the comparison was made using the following parameters:

1. **Initial Development Speed**: How fast the team can go from scratch to implement the first functionalities (5 no complex configurations are needed - 1 the pattern needs a lot of configuration).
2. **Learning Curve**: How easy the 4 team members understand the pattern's rules without commiting design mistakes (5 low learning curve - 1 high learning curve).
3. **Infraestructure Complexity**: Evaluates if complex deployments are needed or a monolithic deploy is enough. (5 enough with a monolithic deploy - 1 complex deploy).
4. **Code Overload**: Measures the amount of repetitive code needed to follow the pattern's rules (5 low count of files/interfaces - 1 a lot of repeated interfaces/files are needed).
5. **Technical Change Tolerance**: How easy is to change eternal componentes like, last-minute changes or to switch the ORM package (5 reduced complexity to apply the changes - 1 high complexity applying changes).

The pattern with the highest rating will be the most switable for the project:

|Parameter|n_layer|Hexagonal|Microservices|
|-|:-:|:-:|:-:|
|**Initial Development Speed**|0|0|0|
|**Learning Curve**|0|0|0|
|**Infraestructure Complexity**|0|0|0|
|**Code Overload**|0|0|0|
|**Technical Change Tolerance**|0|0|0|
|**$\sum$ TOTAL:**|**0**|**0**|**0**|

The previous table shows that the most suitable architectural pattern for the project is {PATTERN_NAME}.
___


# ORM Package
Having selected the most suitable architectural pattern, the next step is the ORM package selection following the previous comparison method.

## Investigation
Here we briefly describe both ORM packages:

#### TypeOrm
{TYPEORM_DESC}

#### Prisma
{PRISMA_DESC}

## Comparison
Here are the parameters used for the ORM package comparison:

1. **Learning Curve**: How fast the team can understand the CRUD syntax for complex queries. (5 easy - 1 difficult)
2. **Migration Management**: How easy is to create, and modify changes to the database scheme. (5 easy - 1 complex).
3. **Initial Configuration**: How fast can be configured and connected to the database in the first day (5 very fast - 1 more than one day).
4. **Relationship Management**: How intuitive and type safe is to get many to many, one to many related data (5 intuitive - 1 needs deep documentation research).
5. **Framework Integraiton**: How compatible is to attach the ORM with typescript and the selected architectural pattern structure (5 easy - 1 complex)

The ORM with the highest rating will be the most switable for the project:

|Parameter|TypeORM|Prisma|
|-|:-:|:-:|
|**Learning Curve**|0|0|
|**Migration Management**|0|0|
|**Initial Configuration**|0|0|
|**Relationship Management**|0|0|
|**Framework Integration**|0|0|
|**$\sum$ TOTAL:**|**0**|**0**|

The previous table shows that the most suitable ORM package for the project is {ORM_NAME}.

