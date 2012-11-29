using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Timers;
using Board.Data;
using Board.Service;

namespace Board.RepeatCause {
    class Program {
        [STAThread]
        static void Main(string[] args) {
            System.Timers.Timer aTimer = new System.Timers.Timer();
            aTimer.Elapsed += new ElapsedEventHandler(TimeEvent);
            // 时间间隔，单位毫秒
            aTimer.Interval = 1000 * 60 + 1;
            aTimer.Enabled = true;
            Console.WriteLine("按回车键结束程序");
            Console.ReadLine();
        }

        private static void TimeEvent(object source, ElapsedEventArgs e) {
            //int intHour = e.SignalTime.Hour;
            int intMinute = e.SignalTime.Minute;
            //int intSecond = e.SignalTime.Second;
            //int intMilli = e.SignalTime.Millisecond;
            // 秒是0时执行
            //if (intSecond == 0) {
            //    Console.WriteLine("每分钟的开始执行一次！");
            //}
            //每小时的30分执行
            //if (intMinute == 30) {
            //    DatabaseFactory df = new DatabaseFactory();
            //    PadService service = new PadService(
            //        new PadRepository(df),
            //        new PadtempRepository(df),
            //        new SeatRepository(df),
            //        new FolderRepository(df),
            //        new UnitOfWork(df)
            //    );
            //    string str = service.FloderSeatTree();
            //    StreamWriter sr = File.CreateText(AppDomain.CurrentDomain.BaseDirectory + "/Board.Web/Js/treedata.js");
            //    sr.WriteLine(str);
            //    sr.Close();
            //}
            // 每天10：30：00执行
            //if (intHour == 10 && intMinute == 30 && intSecond == 0) {
            //    Console.WriteLine("在每天10点30分开始执行！");
            //}
        } 
    }
}
