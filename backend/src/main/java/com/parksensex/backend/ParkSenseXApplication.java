package com.parksensex.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * ParkSense-X — Intelligent Parking Platform
 * Spring Boot entry point
 */
@SpringBootApplication
@EnableScheduling
public class ParkSenseXApplication {

    public static void main(String[] args) {
        SpringApplication.run(ParkSenseXApplication.class, args);
    }
}
