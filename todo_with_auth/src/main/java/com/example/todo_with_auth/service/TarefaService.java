package com.example.todo_with_auth.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.todo_with_auth.exception.RegraNegocioException;
import com.example.todo_with_auth.model.Tarefa;
import com.example.todo_with_auth.model.Usuario;
import com.example.todo_with_auth.repository.TarefaRepository;
import com.example.todo_with_auth.repository.UsuarioRepository;

@Service
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final UsuarioRepository usuarioRepository;

    public TarefaService(TarefaRepository tarefaRepository, UsuarioRepository usuarioRepository) {
        this.tarefaRepository = tarefaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // public List<Tarefa> listarTodos() {
    //     return tarefaRepository.findAll();
    // }

    // public Tarefa buscarPorId(Long id) {
    //     return tarefaRepository.findById(id)
    //             .orElseThrow(() -> new NoSuchElementException("Tarefa não encontrada com ID: " + id));
    // }

    public List<Tarefa> listarPorUsuario(Long usuarioId) {
        // Precisamos do objeto usuário para a busca
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));
        System.out.println("Listando tarefas para o usuário: " + usuario.getUsername());
        return tarefaRepository.findByUsuario(usuario);
    }
    
    public Tarefa buscarPorIdPorUsuario(Long id, Long usuarioId) {
        // Precisamos do objeto usuário para a busca
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));
        return tarefaRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new NoSuchElementException("Tarefa não encontrada com ID: " + id + " para o usuário ID: " + usuarioId));
    }

    
    // public Tarefa criarTarefa(Tarefa tarefa) {
    //     tarefa.setId(null);
    //     return tarefaRepository.save(tarefa);
    // }

    // public void deletarPorId(Long id) {
    //     if (id == null || !tarefaRepository.existsById(id)) {
    //         throw new NoSuchElementException("Tarefa não encontrada com ID: " + id);
    //     } 
    //     tarefaRepository.deleteById(id);
    // }

    @Transactional
    public void deletarPorIdPorUsuario(Long id, Long usuarioId) {
        // 1. Busca o usuário no banco pelo ID (que virá da sessão)
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));
        // 2. Busca a tarefa pelo ID e usuário
        Tarefa tarefa = tarefaRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new NoSuchElementException("Tarefa não encontrada com ID: " + id + " para o usuário ID: " + usuarioId));
        // 3. Deleta a tarefa
        tarefaRepository.delete(tarefa);
    }

    @Transactional
    public Tarefa criarTarefaPorUsuario(String texto, Long usuarioId) {
        // 1. Busca o usuário no banco pelo ID (que virá da sessão)
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));

        // 2. Cria a tarefa e associa ao objeto usuário
        Tarefa tarefa = new Tarefa();
        tarefa.setTexto(texto);
        tarefa.setUsuario(usuario); // <--- A MÁGICA ACONTECE AQUI

        return tarefaRepository.save(tarefa);
    }
    
    @Transactional
    public Tarefa criarTarefaPorUsuario(Tarefa tarefa, Long usuarioId) {
        // 1. Busca o usuário no banco pelo ID (que virá da sessão)
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));

        // 2. Associa ao objeto usuário
        tarefa.setUsuario(usuario); // <--- A MÁGICA ACONTECE AQUI

        return tarefaRepository.save(tarefa);
    }
    
    // public Tarefa atualizarTarefa(Tarefa tarefa) {
    //     if (tarefa.getId() == null) {
    //         throw new IllegalArgumentException("ID da tarefa não pode ser nulo para atualização.");
    //     }
    //     Tarefa tarefaExistente = tarefaRepository.findById(tarefa.getId())
    //             .orElseThrow(() -> new NoSuchElementException("Tarefa não encontrada com ID: " + tarefa.getId()));
    //     tarefaExistente.setTexto(tarefa.getTexto());
    //     tarefaRepository.save(tarefaExistente);
    //     return tarefaExistente;
    // }

    @Transactional
    public Tarefa atualizarTarefaPorIdPorUsuario(Tarefa tarefaAtualizada, Long usuarioId) {
        // 1. Busca o usuário no banco pelo ID (que virá da sessão)
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));
        // 2. Busca a tarefa pelo ID e usuário
        Tarefa tarefaExistente = tarefaRepository.findByIdAndUsuario(tarefaAtualizada.getId(), usuario)
                .orElseThrow(() -> new NoSuchElementException("Tarefa não encontrada com ID: " + tarefaAtualizada.getId() + " para o usuário ID: " + usuarioId));
        // 3. Atualiza os campos permitidos
        tarefaExistente.setTexto(tarefaAtualizada.getTexto());
        // 4. Salva a tarefa atualizada
        return tarefaRepository.save(tarefaExistente);
    }

}
