# Monster Hunter Guild technology selection

This file provides brief information about architectural software patterns and the two most common ORM packages (TypeORM & Prisma). Alongside the given information, there are also two tables comparing these technologies using a set of parameters that allow for a rating to be assigned. The technology with the highest rating will be the most suitable for the project. 
___

# Architectural Pattern
This section will compare three architectural patterns: _n_layer, hexagonal and microservices_. To compare these patterns we must investigate them first and then make de comparison.

## Investigation
Here is a brief definition of each pattern, mentioning its advantages and disadvantages.

#### 1. *n_layer*
Organizes the code in sequential layers (Controller -> Service -> Database)

- Initial Development Speed: Excelent, straight line programming, ideal for a fast MVP.
- Learning Curve: Minimum, every developer knows it by default.
- Infraestructure Complexity: Minimum, unique process and server, simple deploy.
- Code Overload: Low, few files and modifications.
- Technical Change Tolerance: Low, highly coupled to database and ORM. Changing technology needs severe code rewriting.

#### 2. *microservices*
The app is divided into autonomous services, each with its own database, communicating over the network.

- Initial Development Speed: Very slow, forces to solve distributed system problems from day one.
- Learning Curve: Very high, requires complex data consitency, network and design patterns concepts knowledge.
- Infraestructure Complexity: Very high, forces to use docker, kubernetes, virtual networks and complex design patterns.
- Code Overload: High, redundant configuration, DTO contracts and single deploy for each service.
- Technical Change Tolerance: High, due its isolation, it is easy to change the technology of a service without afecting the others.

#### 3. *hexagonal*
- Initial Development Speed: Moderate to slow, demands creating a lot of structure before start with real logic.
- Learning Curve: Moderate to high, requires high dependency inversion knowledge.
- Infraestructure Complexity: Minimum, it remains a monolitic deploy process.
- Code Overload: High, forces structur duplication (entities, ports, adapters and mappers).
- Technical Change Tolerance: Maximum, tools and database are "details", changing them does not affect the bussines logic.

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
|**Initial Development Speed**|5|3|2|
|**Learning Curve**|5|4|2|
|**Infraestructure Complexity**|4|5|1|
|**Code Overload**|5|2|3|
|**Technical Change Tolerance**|1|5|4|
|**$\sum$ TOTAL:**|_**20**_|**19**|**12**|

The previous table shows that the most suitable architectural pattern for the project is **N layer**.
___


# ORM Package
Having selected the most suitable architectural pattern, the next step is the ORM package selection following the previous comparison method.

## Investigation
Here we briefly describe both ORM packages:

#### TypeOrm
CLassic ORM, influenced by *Hibernate*, based in OOP concepts, typescript classes and decorators.

- Learning Curve: Moderate, it requires undertanding design patterns such as Data Mapper  or Active Record and the intensive usage of decorator (`@Entity`, `@Column`). Very familiar with Java or .NET.
- Migration management: Complex, migrations are generated comparing the code entities with the real database. CLI can be a little bit complex to configure.
- Initial Configuration: Easy, direct integration through a `DataSource` object. You only define your entity classes and the conection is stablished inmediately.
- Relationship Management: Moderate, decorators are configured within classes (`@ManyToOne`). It is powerfull, but the typing in complex queries is complex.
- Framework Integration: Excelent, fits natively into enterprise architecture frameworks (like NestJS or Typescript).

#### Prisma
Modern and declarative ORM, based in a unique schema file.

- Learning Curve: Minimun, intuitive syntax (it looks like native JavaScript). The client is generated atomatically, with type safety.
- Migration Management: Excelent, `prisma migrate dev` reads the schema file, detects changes and generates and applies a SQL file automatically.
- Initial configuration: Moderate, it requires the CLI instalation, initialize the `schema.prisma`, configure database environment variables and run the generation command.
- Relationship Mangement: Excelent, defines the relations easy and visually. When making queries, it brings related data through `include` or `select`.
- Framework Integration: Good, it works well in every Node.js/Typescript environment. However, with highly OOP frameworks it needs to configure a intermediary service to inject it to the client.

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
|**Learning Curve**|3|4|
|**Migration Management**|3|4|
|**Initial Configuration**|2|4|
|**Relationship Management**|3|4|
|**Framework Integration**|5|3|
|**$\sum$ TOTAL:**|**16**|_**19**_|

The previous table shows that the most suitable ORM package for the project is **Prisma**.

