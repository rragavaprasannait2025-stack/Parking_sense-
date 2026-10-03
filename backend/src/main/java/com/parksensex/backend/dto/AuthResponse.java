package com.parksensex.backend.dto;

import com.parksensex.backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String phone;
        private String createdAt;
    }

    public static UserDto toDto(User user) {
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getPhone(),
            user.getCreatedAt().toString()
        );
    }
}
