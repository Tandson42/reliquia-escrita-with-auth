package com.example.todo_with_auth.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import com.example.todo_with_auth.model.Usuario;
import com.example.todo_with_auth.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        // 1. Bean de Criptografia (Obrigatório para autenticação via banco segura)
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        // 2. Configuração de Segurança HTTP
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                // 1. Configuração do CSRF (Igual ao anterior)
                CookieCsrfTokenRepository tokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
                CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
                requestHandler.setCsrfRequestAttributeName(null);

                http
                                .csrf((csrf) -> csrf
                                                .csrfTokenRepository(tokenRepository)
                                                .csrfTokenRequestHandler(requestHandler)
                                                // Ignora a validação de token CSRF apenas para o H2 Console
                                                .ignoringRequestMatchers("/h2-console/**"))
                                .authorizeHttpRequests((auth) -> auth
                                                .requestMatchers("/",
                                                                "/index.html",
                                                                "/login",
                                                                "/logout",
                                                                "/h2-console/**",
                                                                "/.well-known/**",
                                                                "/styles.css", // Libera CSS principal
                                                                "/script.js", // Libera JS principal
                                                                "/assets/**", // Libera imagens e assets da livraria
                                                                "/api/usuarios" // Permite registro de usuários
                                                )
                                                .permitAll() // Libera acesso à página e endpoints de auth
                                                .anyRequest().authenticated())
                                // CORREÇÃO DO ERRO DE EXIBIÇÃO DO H2:
                                .headers((headers) -> headers
                                                .frameOptions((frame) -> frame.sameOrigin()) // Necessário para o H2
                                                                                             // Console
                                )
                                // 3. Configuração de LOGIN customizado
                                .formLogin((form) -> form
                                                .loginProcessingUrl("/perform_login") // URL que o Spring vai escutar o
                                                                                      // POST
                                                .successHandler((req, res, auth) -> res.setStatus(200)) // Retorna 200
                                                                                                        // OK em vez de
                                                                                                        // redirecionar
                                                .failureHandler((req, res, ex) -> res.setStatus(401)) // Retorna 401
                                                                                                      // Unauthorized se
                                                                                                      // falhar
                                )
                                // 4. Configuração de LOGOUT
                                .logout((logout) -> logout
                                                .logoutUrl("/perform_logout")
                                                .logoutSuccessHandler((req, res, auth) -> res.setStatus(200)) // Retorna
                                                                                                              // 200 OK
                                                                                                              // ao sair
                                                .deleteCookies("JSESSIONID") // Limpa o cookie de sessão
                                )
                                // 5. Tratamento de Exceção para não autenticados (Evita o popup nativo)
                                .exceptionHandling((ex) -> ex
                                                .authenticationEntryPoint(
                                                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));

                return http.build();
        }

        // 2. Carga Inicial de Dados (Para testar, já que o banco H2 nasce vazio)
        @Bean
        public CommandLineRunner carregarUsuarioInicial(UsuarioRepository repository, PasswordEncoder encoder) {
                return args -> {
                        if (repository.findByUsername("admin").isEmpty()) {
                                Usuario admin = new Usuario();
                                admin.setUsername("admin");
                                // IMPORTANTE: Codificar a senha antes de salvar
                                admin.setPassword(encoder.encode("123456"));
                                admin.setRole("ADMIN");

                                repository.save(admin);
                                System.out.println(">>> Usuário ADMIN criado no banco H2 com senha criptografada.");
                        }
                };
        }
}