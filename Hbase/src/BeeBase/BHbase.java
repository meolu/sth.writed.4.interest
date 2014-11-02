package BeeBase;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.core.NewCookie;
import javax.xml.crypto.dsig.keyinfo.KeyValue;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.client.Delete;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.util.Bytes;


public class BHbase {
    // 连接配置
    public static Configuration conf = null;
    
    // 数据库
    public static HTable hTable = null;
    

    public BHbase(String table) {
        this.conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "localhost");
        try {
            this.hTable = new HTable(conf, table);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * @brief 添加记录
     * @param key
     * @param family
     * @param qualifier
     * @param value
     */
    public void addRecord(String key, String family, String qualifier, String value) {
        Put put = new Put(Bytes.toBytes(key));
        put.add(Bytes.toBytes(family), Bytes.toBytes(qualifier), Bytes.toBytes(value));
        try {
            this.hTable.put(put);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * @brief 删除记录
     * @param key
     */
    public void removeRecord(String key) {
        Delete del = new Delete(key.getBytes());
        try {
            this.hTable.delete(del);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
    }

    /**
     * @brief 获取记录
     * @param key
     * @return Result
     */
    public Result getRecord(String key) {
        Result rs = null;
        Get get = new Get(Bytes.toBytes(key));
        try {
            rs = this.hTable.get(get);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return rs;
    }

}
