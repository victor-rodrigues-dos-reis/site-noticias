<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->model('modelHome');
	}

	public function index() {
		$data['onHome'] = "active";
		$noticias = array(
			'noticiasParciais' => $this->modelHome->selectNoticiaParcial(10),
			'principaisDia' => $this->modelHome->selectPrincipaisNoticiasDia(),
			'principaisSemana' => $this->modelHome->selectPrincipaisNoticiasSemana(),
			'principaisMes' => $this->modelHome->selectPrincipaisNoticiasMes(),
		);

		$this->load->view('templates/headerPadrao', $data);
		$this->load->view('paginas/home', $noticias);
	}

	public function carregarMaisNoticias() {
		$ultimaPosicao = $this->input->get('posicao');
		$noticiasParciais = $this->modelHome->selectNoticiaParcialFiltrado($ultimaPosicao, 10);
		$i = 0;

		echo json_encode($noticiasParciais);
	}
}

?>