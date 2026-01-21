package com.example.todo_with_auth.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo_with_auth.dto.TarefaRequestDTO;
import com.example.todo_with_auth.dto.TarefaResponseDTO;
import com.example.todo_with_auth.dto.UsuarioLogado;
import com.example.todo_with_auth.model.Tarefa;
import com.example.todo_with_auth.service.TarefaService;

@RestController
@RequestMapping("/api/tarefas")
public class TarefaController {

    private final TarefaService tarefaService;

    public TarefaController(TarefaService tarefaService) {
        this.tarefaService = tarefaService;
    }

    @GetMapping
    public ResponseEntity<List<TarefaResponseDTO>> listarMinhasTarefas(
            @AuthenticationPrincipal UsuarioLogado usuarioLogado) {

        // 1. Busca as entidades no banco
        List<Tarefa> tarefas = tarefaService.listarPorUsuario(usuarioLogado.getId());
        for (Tarefa t : tarefas) {
            System.out.println("Tarefa encontrada: " + t.getTexto());
        }   

        // 2. Converte para DTO usando Stream
        List<TarefaResponseDTO> resposta = tarefas.stream()
                .map(TarefaResponseDTO::new)
                .toList();

        // 3. Retorna a lista de DTOs
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("{id}")
    public ResponseEntity<TarefaResponseDTO> getById(@PathVariable Long id,
            @AuthenticationPrincipal UsuarioLogado usuarioLogado) {
        TarefaResponseDTO tarefaResponseDTO = new TarefaResponseDTO(
                tarefaService.buscarPorIdPorUsuario(id, usuarioLogado.getId()));
        return ResponseEntity.ok(tarefaResponseDTO);
    }

    @PostMapping
    public ResponseEntity<TarefaResponseDTO> criar(
            @RequestBody TarefaRequestDTO request, // <-- Mudou aqui
            @AuthenticationPrincipal UsuarioLogado usuarioLogado) {

        // Passa request.getTexto() em vez da string direta
        Tarefa novaTarefa = tarefaService.criarTarefaPorUsuario(request.getTexto(), usuarioLogado.getId());

        // Retorna o DTO de resposta (para evitar loop infinito/dados sensíveis)
        return ResponseEntity.ok(new TarefaResponseDTO(novaTarefa));
    }

    @DeleteMapping("{id}")
    public void deleteTarefa(@PathVariable Long id, @AuthenticationPrincipal UsuarioLogado usuarioLogado) {
        tarefaService.deletarPorIdPorUsuario(id, usuarioLogado.getId());
    }

    @PutMapping("{id}")
    public ResponseEntity<TarefaResponseDTO> updateTarefa(@PathVariable Long id, @RequestBody Tarefa tarefaAtualizada,
            @AuthenticationPrincipal UsuarioLogado usuarioLogado) {
        tarefaAtualizada.setId(id);
        TarefaResponseDTO novaTarefaDTO = new TarefaResponseDTO(
                tarefaService.atualizarTarefaPorIdPorUsuario(tarefaAtualizada, usuarioLogado.getId()));
        return ResponseEntity.ok(novaTarefaDTO);
    }

}
