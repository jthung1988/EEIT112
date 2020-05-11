package tw.gameshop.user.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComandProService {

	private ComandProDAO comandProDAO;

	public ComandProService(){		
	}
	
	@Autowired
	public ComandProService(ComandProDAO comandProDAO) {
		this.comandProDAO= comandProDAO;
	}

	public List<ComandPro> QueryAllByProductId(int productId) { // �H�ӫ~id�d�߸Ӱӫ~�Ҧ�����
		return comandProDAO.QueryAllByProductId(productId);
	}

	
	
}
