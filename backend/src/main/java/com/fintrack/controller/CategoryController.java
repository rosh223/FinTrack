package com.fintrack.controller;

import com.fintrack.dto.CategoryRequest;
import com.fintrack.dto.CategoryResponse;
import com.fintrack.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Category", description = "Endpoints for category management")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @Operation(summary = "Add a custom category")
    public ResponseEntity<CategoryResponse> addCategory(@Valid @RequestBody CategoryRequest request, Authentication authentication) {
        return new ResponseEntity<>(categoryService.addCategory(request, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all categories (default and custom)")
    public ResponseEntity<List<CategoryResponse>> getCategories(Authentication authentication) {
        return ResponseEntity.ok(categoryService.getCategories(authentication.getName()));
    }
}
