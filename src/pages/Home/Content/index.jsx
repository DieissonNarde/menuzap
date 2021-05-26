import React from "react";

import LogoName from "../../../assets/images/logo-com-nome.png";
import ImgQrcode from "../../../assets/images/cardapio-qrcode.png";
import IconNotInstall from "../../../assets/icons/not-install.png";
import IconEasyInstall from "../../../assets/icons/easy-install.png";
import IconOptimization from "../../../assets/icons/optimization.png";
import IconReduction from "../../../assets/icons/reduction.png";
import IconSecurity from "../../../assets/icons/security2.png";
import IconSpeed from "../../../assets/icons/speed.png";


function Content() {
    return (
        <div>
            <div className="container content">
                <div className="row banner">
                    <div className="col-sm-5 talk">
                        <div className="img">
                            <img src={LogoName} width="60%" />
                        </div>
                        
                        <br />
                        <h5 className="bold-four">
                            Cardápio digital para seus clientes acessarem o seu catálogo na palma da mão
                            escaneando o QR Code ou pelo site.
                        </h5>
                        <br />
                        <div className="action-button">
                            <h6><a className="btn start-two" href="#planos">ASSINE</a></h6>
                        </div>
                    </div>
                    <div className="col-sm-7 showcase-img">
                        <img src={ImgQrcode} width="100%" />
                    </div>
                </div>
            </div>

            <section id="como-funciona" class="features-icons bg-light text-center det-ails">
                <div class="container">
                    <h2>COMO FUNCIONA</h2>
                    <br />
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class="icon-speedometer m-auto text-primary icon-ails"></i>
                                </div>
                                <h5>Fácil e Rápido</h5>
                                <p class="lead mb-0">Crie o seu cardápio em poucos passos.
                                Imprima seu QR Code e cole onde seus clientes possam ver.</p>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class="icon-screen-smartphone m-auto text-primary icon-ails"></i>
                                </div>
                                <h5>Para Acessar</h5>
                                <p class="lead mb-0">O seu cliente aponta a camera do celular para o QR Code e é redirecionado
                                automaticamente para o seu cardápio,sem a necessidade de instalação de um aplicativo</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>

            <section id="beneficios" class="features-icons bg-light text-center det-ails">
                <div class="container">
                    <h2>ALGUNS BENEFÍCIOS</h2>
                    <br />
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class=" m-auto text-primary icon-ails">
                                        <img src={IconNotInstall} width="60px" />
                                    </i>
                                </div>
                                <h5>Não Precisa Instalar</h5>
                                <p class="lead mb-0 text-benef">Para usar o Menu Play é só ler o QR Code com a câmera do seu dispositivo
                                que o cardápio do estabelecimento irá abrir no navegador do seu cliente.</p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class=" m-auto text-primary icon-ails">
                                        <img src={IconSpeed} width="60px" />
                                    </i>
                                </div>
                                <h5>Agilidade no Atendimento</h5>
                                <p class="lead mb-0 text-benef">O cliente consegue realizar o próprio atendimento, tirando todas
                                as dúvidas e observando detalhes do pedido.</p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class=" m-auto text-primary icon-ails">
                                        <img src={IconOptimization} width="60px" />
                                    </i>
                                </div>
                                <h5>Otimização da Equipe</h5>
                                <p class="lead mb-0 text-benef">O nosso cardápio digital desafoga os seus garçons, diminuindo o número
                                de atendimento realizado pelos mesmos, portanto cada garçom poderá dar mais atenção aos seus clientes a cada atendimento realizado.</p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class=" m-auto text-primary icon-ails">
                                        <img src={IconReduction} width="60px" />
                                    </i>
                                </div>
                                <h5>Redução de Custos</h5>
                                <p class="lead mb-0 text-benef">Economizando com funcionários, erros de produção, gastos com gráficas para
                                fazer novos cardápios, e aumentando sua capacidade de atendimento, os lucros do seu negócio tendem a somente aumentar.</p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class=" m-auto text-primary icon-ails">
                                        <img src={IconEasyInstall} width="60px" />
                                    </i>
                                </div>
                                <h5>Fácil Atualização</h5>
                                <p class="lead mb-0 text-benef">Atualizando produtos no gestor do nosso cardápio digital, nosso sistema atualiza automaticamente seu cardápio
                                para seu cliente, proporcionando inúmeros benefícios para seu estabelecimento, como economizar com gráficas para produzir um novo cardápio a cada alteração de cardápio.</p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div class="features-icons-icon d-flex  icon-bra-ails">
                                    <i class=" m-auto text-primary icon-ails">
                                        <img src={IconSecurity} width="60px" />
                                    </i>
                                </div>
                                <h5>Segurança e Higiene</h5>
                                <p class="lead mb-0 text-benef">Passe mais confiança a seus clientes, seguindo de forma simples os protocolos de higiêne recomendados pela OMS, elimindo o cardapio impresso.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Content;