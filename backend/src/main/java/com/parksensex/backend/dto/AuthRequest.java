package com.parksensex.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthRequest {

    @Data
    public static class Login {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class Register {
        @NotBlank
        @Size(min = 2, max = 100)
        private String name;

        @Email
        @NotBlank
        private String email;

        @NotBlank
        @Size(min = 8, max = 100)
        private String password;

        private String phone;
    }
}
