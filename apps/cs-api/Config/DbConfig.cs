using Npgsql;

namespace cs_api.Config;

public class DbConfig
{
    private readonly NpgsqlDataSource _dataSource;

    public DbConfig(IConfiguration configuration)
    {
        var db = configuration.GetSection("Database");
        var connectionString = new NpgsqlConnectionStringBuilder
        {
            Host = db["Host"] ?? "localhost",
            Port = int.Parse(db["Port"] ?? "5432"),
            Database = db["Name"] ?? "schedule_share",
            Username = db["User"] ?? "postgres",
            Password = db["Password"] ?? "postgres",
            MaxPoolSize = 20,
            ConnectionIdleLifetime = 30,
            Timeout = 2
        }.ToString();

        _dataSource = NpgsqlDataSource.Create(connectionString);
    }

    public NpgsqlDataSource DataSource => _dataSource;
}
