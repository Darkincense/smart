package com.richfit.bjsop.dao.comm;

import java.util.List;
import java.util.Map;

public interface DBOperate {
	public int executeEntity(String nameSpace,Map mapParam);
	public int insert(String nameSpace,Map mapParam);
	public int update(String nameSpace,Map mapParam);
	public int delete(String nameSpace,Map mapParam);
	public List<Map> select(String nameSpace,Map mapParam);
	public void commit(boolean force);
	public void rollback(boolean force);
}
