package com.fintrack.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KeepAliveService {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveService.class);
    
    // The public URL of the Render deployment
    private static final String RENDER_URL = "https://fintrack-vmcu.onrender.com/";
    
    private final RestTemplate restTemplate;

    public KeepAliveService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Render free instances spin down after 15 minutes of inactivity.
     * This scheduled task pings the root health endpoint every 10 minutes (600,000 ms)
     * to keep the instance alive.
     */
    @Scheduled(fixedRate = 600000)
    public void pingRender() {
        try {
            logger.info("Pinging Render URL to keep the instance alive...");
            String response = restTemplate.getForObject(RENDER_URL, String.class);
            logger.info("Keep-alive ping successful. Response: {}", response);
        } catch (Exception e) {
            logger.error("Keep-alive ping failed: {}", e.getMessage());
        }
    }
}
