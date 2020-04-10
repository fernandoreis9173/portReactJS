import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import { Table, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import './styles.css';
import ReactPaginate from 'react-paginate'; 

class FormContact extends Component {

  state = { 
    model: {
      nome: '', 
      email: '', 
      telefone: '' 
    } 
  };

  setValues = (e, field) => {
    const { model } = this.state;
    model[field] = e.target.value;
    this.setState({ model });
  }

  create  = () => {
    this.setState({ model:{ nome: '', email: '', telefone: '' }  });
    this.props.contactCreate(this.state.model);
  }

  componentWillMount() {
    PubSub.subscribe('edit-contact', (topic, contact) => {
      this.setState({ model: contact });
    });
  }

  render() {
    return (
      <Form >
        <FormGroup>
          <Label for="nome">Nome</Label>
          <Input id="nome" value={this.state.model.nome} type="text" placeholder="Digite o seu Nome" onChange={ e => this.setValues(e, 'nome')} ></Input>
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input id="email" value={this.state.model.email} type="text" placeholder="Digite o seu Email" onChange={ e => this.setValues(e, 'email')} ></Input>
        </FormGroup>
        <FormGroup>
          <Label for="telefone">Telefone</Label>
          <Input id="telefone" value={this.state.model.telefone} type="text" placeholder="Digite o seu Telefone" onChange={ e => this.setValues(e, 'telefone')} ></Input>
        </FormGroup>
        <FormGroup>
          <Button onClick={this.create} color="primary">Salvar Contato</Button>
        </FormGroup>
      </Form>
    );
  }
}

class ContactFilter extends Component {
  
  handleChange (event) {
    this.props.updateSearch(event.target.value);
  }
  
  render () {
    return (
      <Input type="text" placeholder="Procurar Contato" className="input-search" onChange={this.handleChange.bind(this)} value={this.props.searchText} />
    )
  }
}

class ListContact extends Component {
  
  delete = (_id) => {
    this.props.deleteContact(_id);
    alert ('Deletado Com Sucesso');
  }

  onEdit = ( contact ) => {
    PubSub.publish('edit-contact', contact);
  }

  filter (contacts) {
    if (!this.props.filter) {
      return contacts
    }
    return contacts.filter((contact) => contact.nome.toString().toLowerCase().indexOf(this.props.filter.toLowerCase()) >= 0)
  }
  
  render() {
    const { contacts } = this.props;
    return (
      <Table responsive>
        <thead className="bg-primary">
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {
            this.filter(contacts)
            .map(contact => (
              <tr key={contact._id} >
                <td>{contact.nome}</td>
                <td>{contact.email}</td>
                <td>{contact.telefone}</td>
                <td><Button color="info" size="sm" onClick={ e => this.onEdit( contact ) }>Editar</Button>
                  <Button color="danger" size="sm" onClick={ e => this.delete( contact._id )}>Excluir</Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    );
  }
}

export default class ContactBox extends Component {

  url = "https://nameless-badlands-32634.herokuapp.com/api/contacts";

  state = {
    contacts: [],
      message: {
        text: '',
        alert: ''
      },
      currentPageNumber: 1,
      totalPages: 1,
      totalItems: 1,
      limit: 10,
      filter: null
  }

  getContact(pageNumber) {
    let p = new URLSearchParams();
    p.append('page', pageNumber || 1);
    console.log(this.url, this.url + '?' + p);
    fetch(this.url+'?'+p)
      .then(response => response.json())
      .then(response => this.setState({ 
        contacts: response.docs,
        totalPages: response.pages,
        currentPageNumber: response.page,
        totalItems: response.total,
        limit: response.limit }))
      .catch(e => console.log(e));
  }

  handleSelect(number) {
    let n = number.selected + 1;
    this.setState({currentPageNumber: number});
    this.getContact(n);
  }

  componentDidMount() {
    this.getContact(this.currentPageNumber);
  }

  fetchBlogPosts(pageNumber) {
    let p = new URLSearchParams();
    p.append('page', pageNumber || 1);

    console.log(this.url, this.url + '?' + p);

    return fetch(this.url + '?' + p, {
        method: 'GET',
        mode: 'CORS'
      })
      .then(res => res.json())
      .catch(err => err);
  }

  save = (contact) => {
    let data = {
      _id: contact._id,
      nome: contact.nome, 
      email: contact.email, 
      telefone: contact.telefone
    }; 

    const requestInfo = {
      method: data._id != null ? 'PUT':'POST',
      body: JSON.stringify(data), 
      headers: new Headers({
        'Content-type': 'application/json'
      })

    };
    
    if ( data._id == null) {
      fetch(this.url, requestInfo)
      .then(response => response.json())
      .then(newContact => {
        let { contacts } = this.state; 
        contacts.push(newContact); 
        this.setState({ contacts, message: { text: "Novo Contado Adicionado", alert: 'success' } });
        this.timerMessage(3000);
      })
      .catch( e => console.log(e) );
    } else {
      fetch(`${ this.url }/${ data._id }`, requestInfo)
        .then(response => response.json())
        .then(updatedContact => {
          let { contacts } = this.state;
          
          let position = this.state.contacts.findIndex(contact => contact._id === data._id);
          contacts[position] = updatedContact;
          this.setState({ contacts, message: { text: "Contato Atualizado", alert: 'info' } });
          this.timerMessage(3000);
        })
        .catch( e => console.log(e) );
    }
    
  }

  delete = (_id) => {
    fetch(`${ this.url }/${ _id }`, { method: 'DELETE' })
      .then(response => response.json())
      .then(rows => {
        const contacts = this.state.contacts.filter(contact => contact._id !== _id);
        this.setState({ contacts,  message: { text: 'Contato Deletado', alert: 'danger' } });
        this.timerMessage(3000);
      })
      .catch(e => console.log(e));
  };

  timerMessage = (duration) => {
    setTimeout(() => {
      this.setState({ message: { text: '', alert: ''} });
    }, duration);
  }

  updateSearch (inputValue) {
    let filter = this.state.filter;
    
    this.setState({
      filter: inputValue
    });
  }

  render() {
    return (
      <div className="contact-box">
        {
          this.state.message.text !== ''? (
              <Alert color={this.state.message.alert} className="text-center"> {this.state.message.text} </Alert>
          ) : ''
        } 

        <div>
          <div >
            <h3>Adicionar Contato</h3>
            <FormContact contactCreate={this.save}/>
          </div>
          <div >
            <h3>Lista de Contato</h3>
            <ContactFilter  updateSearch={this.updateSearch.bind(this)} searchText={this.state.filter} />
            <ListContact contacts={this.state.contacts} deleteContact={ this.delete } filter={this.state.filter} />
            <ReactPaginate
              previousLabel={'Anterior'}
              nextLabel={'Próximo'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.state.totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handleSelect.bind(this)}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
              activeLinkClassName	= {'active'}
            />
          </div>
        </div>
      </div>
    );
  }
}