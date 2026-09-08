package com.miora.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendGiftRequest {
    @NotBlank(message = "Recipient profile ID is required")
    @Size(max = 128, message = "Recipient profile ID is too long")
    private String recipientProfileId;

    @NotBlank(message = "Gift ID is required")
    @Size(max = 64, message = "Gift ID is too long")
    private String giftId;

    @Size(max = 100, message = "Gift name is too long")
    private String giftName;

    @Size(max = 16, message = "Gift emoji is too long")
    private String giftEmoji;

    @NotNull(message = "Gift cost is required")
    @Min(value = 1, message = "Gift cost must be at least 1 coin")
    @Max(value = 10000, message = "Gift cost cannot exceed 10,000 coins")
    private Integer costCoins;
}
