# Database Setup

## Prerequisites

* MySQL Server installed
* MySQL Workbench (optional)

## Database Initialization

Alternatively, open `db/init.sql` in MySQL Workbench and run the script.

## Verification

Verify that the database was created successfully:

```sql
SHOW DATABASES;
```

The following database should appear:

```text
monster_hunter_guild
```

Select the database:

```sql
USE monster_hunter_guild;
```

If no errors are returned, the database has been configured successfully.
