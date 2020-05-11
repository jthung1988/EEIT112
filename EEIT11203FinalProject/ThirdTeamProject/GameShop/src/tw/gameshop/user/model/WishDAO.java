package tw.gameshop.user.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

@Repository
public class WishDAO {
	private SessionFactory sessionFactory;

	@Autowired
	public WishDAO(@Qualifier(value="sessionFactory") SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	public boolean insertWish(int userId, int productId) {
		Session session = sessionFactory.getCurrentSession();
		try {
			Wish wish = new Wish();
			wish.setUserId(userId);
			wish.setProductId(productId);
			session.save(wish);
			System.out.println("save your wish");
			return true;
		}catch(Exception e) {
			return false;
		}
	}
	
	public List<Wish> queryUniqueWish(int userId, int productId) {
		Session session = sessionFactory.getCurrentSession();
		Query<Wish> query = session.createQuery("from Wish where userId=?0 and productId=?1", Wish.class);
		query.setParameter(0, userId);
		query.setParameter(1, productId);
		List<Wish> list = query.list();
		return list;
	}
	
	public boolean deleteWish(int userId, int productId) {
		Session session = sessionFactory.getCurrentSession();
		try {
			Query<Wish> query = session.createQuery("from Wish where userId=?0 and productId=?1", Wish.class);
			query.setParameter(0, userId);
			query.setParameter(1, productId);
			List<Wish> list = query.list();
			list.get(0).setAccomplish("d");
			return true;
		}catch(Exception e) {
			return false;
		}
	}
	
	public boolean updateWish(int userId, int productId) {
		Session session = sessionFactory.getCurrentSession();
		try {
			Query<Wish> query = session.createQuery("from Wish where userId=?0 and productId=?1", Wish.class);
			query.setParameter(0, userId);
			query.setParameter(1, productId);
			List<Wish> list = query.list();
			list.get(0).setAccomplish("a");
			return true;
		}catch(Exception e) {
			return false;
		}
	}
	
	public List<Wish> queryAllWishByUserId(int userId) {
		Session session = sessionFactory.getCurrentSession();
		Query<Wish> query = session.createQuery("from Wish where userId=?0 and accomplish='w'", Wish.class);
		query.setParameter(0, userId);
		List<Wish> list = query.list();
		return list;
	}
	
	//send email(get userId save in list)
	public LinkedList<Integer> queryByProductId(int productId) {
		Session session = sessionFactory.getCurrentSession();
		Query<Wish> query = session.createQuery("from Wish where productId=?0", Wish.class);
		query.setParameter(0, productId);
		List<Wish> list = query.list();
		LinkedList<Integer> userList = new LinkedList<Integer>();
		for (Wish wish:list) {
			userList.add(wish.getUserId());
		}
		return userList;
	}
	
	/**
	 * @author kunhung
	 * @apiNote Bms Wish Chart Dao
	 * @return List<Map<Object, Object>>
	 */
	public List<Map<Object, Object>> queryAllWish() {
		String hqlStr = "Select productId, count(productId) as n from Wish Where accomplish not in('d') group by productId Order by n";
		List list = sessionFactory.getCurrentSession().createQuery(hqlStr).list();
		
		List<Map<Object, Object>> resultList = new ArrayList<Map<Object, Object>>();
		
		Iterator iter = list.iterator();
		while( iter.hasNext() ) {
			Map<Object, Object> r = new HashMap<Object, Object>();
			Object[] obj = (Object[])iter.next();
			r.put("productId", obj[0]);
			r.put("NumOfWish", obj[1]);
			resultList.add(r);
		}
		return resultList;
	}

}
