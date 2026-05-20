namespace ReactApp1.Server.Model
{
    public class ProblemHold
    {
        public int Id { get; set; }
        public int ProblemId { get; set; }
        public int HoldId { get; set; }
        public int HoldOrder { get; set; }
        public string Role { get; set; }

        public Problem? Problem { get; set; }
        public Hold? Hold { get; set; }
    }
}
