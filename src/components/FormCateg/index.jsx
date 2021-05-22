import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

import { Form } from './style';

const FormAdd = () => {
    return (
      
        <Form>
          <h1>Nova Categoria</h1>
          <InputLabel>Imagem</InputLabel>
          <Input name="image" placeholder="Cole o link aqui" />
          <InputLabel>Nome</InputLabel>
          <Input name="name" placeholder="Ex: Café da Manhã" />
          <InputLabel>Descrição</InputLabel>
          <Input name="description" placeholder="Descrição" />
          
          <Input type="button" value="Adicionar Categoria" />
        </Form>
      
      
    );
}
 
export default FormAdd;

{/* <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form> */}







{/* <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form> */}
