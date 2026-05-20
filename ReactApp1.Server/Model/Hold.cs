namespace ReactApp1.Server.Model
{
    public class Hold
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public float PositionX { get; set; }
        public float PositionY { get; set; }
    }
}
