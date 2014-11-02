package BeeBase;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.Test;

import BeeBase.BHbase;

public class BHbaseTest {
    public static BHbase bHbaseTest = null;

    public void testBHbase() {

    }

    @Test
    public void testString() {
        List list = new ArrayList();
    }
    @Test
    public void testAddRecord() {
        BHbase bHbaseTest = new BHbase("love");
        bHbaseTest.addRecord("test", "info", "mather", "wu\'s mather");
        this.printResult("love", "test");
        bHbaseTest.addRecord("test", "info", "mather", "wu\'s father");
        this.printResult("love", "test");
    }

    @Test
    public void removeRecord() {
        BHbase bHbaseTest = new BHbase("love");
        bHbaseTest.removeRecord("test");
        this.printResult("love", "test");
    }
    
    public static void printResult(String table, String key) {
        BHbase bHbaseTest = new BHbase(table);
        Result rs = bHbaseTest.getRecord(key);
        System.out.println("======s======");
        for(org.apache.hadoop.hbase.KeyValue kv : rs.raw()) {
            byte[] family = kv.getValue();
            System.out.println(Bytes.toString(family));
        }
        System.out.println("======e======");
    }
    
}
